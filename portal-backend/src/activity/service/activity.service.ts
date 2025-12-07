import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/User.entity';
import { DataSource } from 'typeorm';
import { WithTransactionService } from '../../app/services/with-transaction.services';
import { CategoryService } from '../../category/services/category.service';
import { ImageFileService } from '../../image/services/image-file.service';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { SubscriptionService } from '../../subscription/services/subscription.service';
import { UploadService } from '../../upload/service/upload.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { PAGINATION_ITEMS_PER_PAGE, PaginationQueryDto } from '../dto/paginationQuery.dto';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { ListWithActivityPaginationResponseDto } from '../dto/response-dto/ListWithActivityPaginationResponse.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';
import { ActivityRepository } from '../repositories/activity.repository';

const UN_SUBSCRIBED_MAX_ACTIVITIES = 10;
@Injectable()
export class ActivityService extends WithTransactionService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly imageUploadService: UploadService,
    private readonly categoryService: CategoryService,
    private readonly imageFileService: ImageFileService,
    private readonly subscriptionService: SubscriptionService,
    private readonly logService: AppLoggerService,
    private readonly datasource: DataSource,
  ) {
    super();
  }

  async createActivity(
    emailAddress: string,
    dto: CreateActivityDto,
    headers: HeadersInit,
    file?: Express.Multer.File[],
  ) {
    const transaction = await this.createTransaction(this.datasource);

    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email: emailAddress,
        },
      });

      await this.validateActivityCreation(user, dto, file, headers);

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);

      if (!category) {
        // Apply transaction to category creation
        category = await this.datasource.transaction(async (entityManager) => {
          return await this.categoryService.createCategory(
            { categoryName: dto.categoryName },
            user.email,
            headers,
            entityManager, // Pass the entity manager to handle the transaction
          );
        });
      }

      const activity = await this.activityRepository.create({
        activity_title: dto.activityTitle,
        price: dto.price,
        location: dto.location || null,
        rating: dto.rating,
        description: dto.description,
        user: user,
        category_id: category.id,
        date_created: new Date(),
        date_updated: new Date(),
      });

      const savedActivity = await this.activityRepository.save(activity);

      if (file && file.length > 0) {
        const uploadedFiles = await Promise.all(
          file.map(async (file) => await this.imageUploadService.upload(file)),
        );

        await Promise.all(
          uploadedFiles.map(
            async (uploadedFile) =>
              await this.imageFileService.storeImageFile(
                uploadedFile.Location,
                uploadedFile.Key,
                savedActivity.id,
                user,
              ),
          ),
        );
      }

      await transaction.commitTransaction();
      return savedActivity;
    } catch (err) {
      await transaction.rollbackTransaction();
      await this.logService.debug(err);
      throw err;
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  async getAllUserActivities(
    emailAddress: string,
    search: string,
    paginationDto?: PaginationQueryDto,
  ): Promise<ListWithActivityPaginationResponseDto<ActivityResponseDto>> {
    const startOffset = paginationDto?.offset ?? 0;
    const activityLimit = paginationDto?.limit ?? PAGINATION_ITEMS_PER_PAGE;
    let activityCount = null;
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email: emailAddress,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not logged in');
      }

      const activities = await this.activityRepository.getAllUserActivities(
        user.id,
        search,
        startOffset,
        activityLimit,
      );

      if (startOffset === 0) {
        activityCount = await this.activityRepository.getActivityCount(search, user.id);
      }
      let activityResponse: ActivityResponseDto[] = [];

      for (const activity of activities) {
        const imageFile = await this.imageFileService.getImageFileById(activity.id, user.id);
        const imageUrl = imageFile
          ? await this.imageUploadService.getImageStreamFromS3(imageFile.key)
          : '';

        activityResponse.push({
          id: activity.id,
          activityTitle: activity.activity_title,
          categoryName: activity.category.category_name,
          categoryId: activity.category.id,
          location: activity.location,
          price: activity.price,
          rating: activity.rating,
          description: activity.description,
          dateCreated: activity.date_created,
          dateUpdated: activity.date_updated,
          imageUrls: imageUrl,
        });
      }

      return {
        offset: startOffset,
        limit: activityLimit,
        count: activityCount,
        data: activityResponse,
      };
    } catch (err) {
      await this.logService.debug(err);
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw err;
    }
  }

  async getUserActivity(activityId: number, emailAddress: string): Promise<ActivityResponseDto> {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email: emailAddress,
        },
      });
      const activity = await this.activityRepository.getActivityByUserIdAndActivityId(
        activityId,
        user.id,
      );

      if (!activity) {
        throw new NotFoundException('Activity not found.');
      }

      const imageUrls: string[] | null = [];
      const imageFile = await this.imageFileService.fetchImageFilesById(activity.id, user.id);
      for (const image of imageFile) {
        const url = await this.imageUploadService.getImageStreamFromS3(image.key);
        imageUrls.push(url);
      }

      return {
        id: activity.id,
        activityTitle: activity.activity_title,
        categoryName: activity.category.category_name,
        categoryId: activity.category.id,
        location: activity.location,
        price: activity.price,
        rating: activity.rating,
        description: activity.description,
        dateCreated: activity.date_created,
        dateUpdated: activity.date_updated,
        imageUrls: imageUrls,
      };
    } catch (err) {
      await this.logService.debug(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Could not fetch activity');
    }
  }

  async getUserActivitiesByCategory(
    categoryId: number,
    emailAddress: string,
    paginationDto?: PaginationQueryDto,
  ): Promise<ListWithActivityPaginationResponseDto<ActivityResponseDto>> {
    try {
      const startOffset = paginationDto?.offset ?? 0;
      const activityLimit = paginationDto?.limit ?? PAGINATION_ITEMS_PER_PAGE;
      let activityCount = null;
      const user = await this.userAccountRepository.findOne({
        where: {
          email: emailAddress,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const activities = await this.activityRepository.getUserActivitiesByCategory(
        categoryId,
        user.id,
        startOffset,
        activityLimit,
      );
      if (startOffset === 0) {
        activityCount = await this.activityRepository.getActivityCount('', user.id);
      }

      let activityResponse: ActivityResponseDto[] = [];

      for (const activity of activities) {
        const imageFile = await this.imageFileService.getImageFileById(activity.id, user.id);
        const imageUrl = imageFile
          ? await this.imageUploadService.getImageStreamFromS3(imageFile.key)
          : null;

        activityResponse.push({
          id: activity.id,
          activityTitle: activity.activity_title,
          categoryName: activity.category.category_name,
          categoryId: activity.category.id,
          location: activity.location,
          price: activity.price,
          rating: activity.rating,
          description: activity.description,
          dateCreated: activity.date_created,
          dateUpdated: activity.date_updated,
          imageUrls: imageUrl,
        });
      }

      return {
        offset: startOffset,
        limit: activityLimit,
        count: activityCount,
        data: activityResponse,
      };
    } catch (err) {
      await this.logService.debug(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Could not fetch activities by category');
    }
  }

  async getUserActivitiesByCategoryName(
    categoryName: string,
    emailAddress: string,
  ): Promise<ActivityResponseDto[]> {
    try {
      const user = await this.userAccountRepository.findOne({
        where: { email: emailAddress },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const category = await this.categoryService.getCategoryByName(categoryName, user.id);

      //const category = await this.categoryRepository.findOne({ where: { name: categoryName } });
      if (!category) {
        throw new NotFoundException(`Category with name ${categoryName} not found`);
      }

      const activities = await this.activityRepository.find({
        where: {
          user: { id: user.id },
          category: { id: category.id },
        },
        relations: ['category'],
      });

      let activityResponse: ActivityResponseDto[] = [];

      for (const activity of activities) {
        const imageFile = await this.imageFileService.getImageFileById(activity.id, user.id);
        const imageUrl = await this.imageUploadService.getImageStreamFromS3(imageFile.key);

        activityResponse.push({
          id: activity.id,
          activityTitle: activity.activity_title,
          categoryName: activity.category.category_name,
          categoryId: activity.category.id,
          location: activity.location,
          price: activity.price,
          rating: activity.rating,
          description: activity.description,
          dateCreated: activity.date_created,
          dateUpdated: activity.date_updated,
          imageUrls: imageUrl,
        });
      }

      return activityResponse;
    } catch (err) {
      await this.logService.debug(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Could not fetch activities');
    }
  }

  async updateActivity(
    activityId: number,
    dto: UpdateActivityDto,
    emailAddress: string,
    headers: HeadersInit,
    files?: Express.Multer.File[],
  ) {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email: emailAddress,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not logged in');
      }

      const activity = await this.activityRepository.getActivityByUserIdAndActivityId(
        activityId,
        user.id,
      );

      if (!activity) {
        throw new NotFoundException();
      }

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);
      if (!category) {
        category = await this.categoryService.createCategory(
          { categoryName: dto.categoryName },
          user.email,
          headers,
        );
      }

      const activityData: Partial<Activity> = {
        activity_title: dto.activityTitle,
        category_id: category.id,
        price: dto.price,
        location: dto.location,
        rating: dto.rating,
        description: dto.description,
        date_updated: new Date(),
      };

      const updatedActivity = await this.activityRepository.updateActivity(activity, activityData);
      if (files && files.length > 0) {
        const uploadedFiles = await Promise.all(
          files.map(async (file) => await this.imageUploadService.upload(file)),
        );

        await Promise.all(
          uploadedFiles.map(
            async (uploadedFile) =>
              await this.imageFileService.storeImageFile(
                uploadedFile.Location,
                uploadedFile.Key,
                updatedActivity.id,
                user,
              ),
          ),
        );
      }
    } catch (err) {
      await this.logService.debug(err);
      throw new InternalServerErrorException('Could not update activity');
    }
  }

  async deleteActivity(activityId: number, emailAddress: string) {}

  private async validateActivityCreation(
    user: User,
    dto: CreateActivityDto,
    file?: Express.Multer.File[],
    headers?: HeadersInit,
  ) {
    // Check subscription status
    const isSubscriptionActive = await this.subscriptionService.getActiveSubscription(headers);

    const userRole = await this.userAccountRepository.findUserRoleById(user.id);

    // Count user's activities
    const activityCount = await this.activityRepository.count({ where: { user: { id: user.id } } });

    // Restrict activity creation only for 'user' role without active subscription
    if (
      userRole === 'user' &&
      !isSubscriptionActive &&
      activityCount >= UN_SUBSCRIBED_MAX_ACTIVITIES
    ) {
      throw new ForbiddenException({
        message: 'Maximum activities',
      });
    }

    // Restrict file upload if subscription is not active and more than 1 file is uploaded
    if (!isSubscriptionActive && file && file.length > 1) {
      throw new ForbiddenException({
        message: 'Maximum upload',
      });
    }

    // Check for existing activity with the same title
    const existingActivity = await this.activityRepository.findOne({
      where: {
        activity_title: dto.activityTitle,
        user: { id: user.id },
      },
    });

    if (existingActivity) {
      throw new ForbiddenException('Activity with this title already exists.');
    }
  }
}
