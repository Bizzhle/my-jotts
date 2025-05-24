import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WithTransactionService } from '../../app/services/with-transaction.services';
import { CategoryService } from '../../category/services/category.service';
import { ImageFileService } from '../../image/services/image-file.service';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { SubscriptionStatus } from '../../subscription/enum/subscrition.enum';
import { SubscriptionService } from '../../subscription/services/subscription.service';
import { UploadService } from '../../upload/service/upload.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';
import { ActivityRepository } from '../repositories/activity.repository';

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

  async createActivity(emailAddress: string, dto: CreateActivityDto, file?: Express.Multer.File[]) {
    const transaction = await this.createTransaction(this.datasource);

    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email_address: emailAddress,
        },
      });

      await this.validateActivityCreation(user.id, emailAddress, dto, file);

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);

      if (!category) {
        // Apply transaction to category creation
        category = await this.datasource.transaction(async (entityManager) => {
          return await this.categoryService.createCategory(
            { categoryName: dto.categoryName },
            user.email_address,
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
        user_id: user.id,
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
                user.id,
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

  async getAllUserActivities(emailAddress: string, search: string): Promise<ActivityResponseDto[]> {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email_address: emailAddress,
        },
      });

      if (!user) {
        throw new BadRequestException('User not logged in');
      }

      const subscription = await this.subscriptionService.getUserSubscriptionInformation(
        emailAddress,
      );
      const isSubscriptionActive = subscription && subscription.status === 'active';

      let activities;
      if (isSubscriptionActive) {
        activities = await this.activityRepository.getAllUserActivities(user.id, search);
      } else {
        activities = await this.activityRepository.getAllUserActivities(user.id, search, {
          take: 5,
          order: { date_created: 'DESC' },
        });
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
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Could not fetch activities');
    }
  }

  async getUserActivity(activityId: number, emailAddress: string): Promise<ActivityResponseDto> {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email_address: emailAddress,
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

  async getUserActivitiesByCategory(categoryId: number, emailAddress: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    return await this.activityRepository.getUserActivitiesByCategory(categoryId, user.id);
  }

  async getUserActivitiesByCategoryName(
    categoryName: string,
    emailAddress: string,
  ): Promise<ActivityResponseDto[]> {
    try {
      const user = await this.userAccountRepository.findOne({
        where: { email_address: emailAddress },
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
          user_id: user.id,
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
    files?: Express.Multer.File[],
  ) {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email_address: emailAddress,
        },
      });

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
          user.email_address,
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
                user.id,
              ),
          ),
        );
      }

      return updatedActivity;
    } catch (err) {
      await this.logService.debug(err);
      throw new InternalServerErrorException('Could not update activity');
    }
  }

  async deleteActivity(activityId: number, emailAddress: string) {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email_address: emailAddress,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not logged in');
      }

      const activity = await this.activityRepository.findOne({
        where: {
          id: activityId,
          user_id: user.id,
        },
        relations: ['imageFiles'], // Load related image files
      });

      if (!activity) {
        throw new NotFoundException('Activity not found.');
      }

      const activityImage = await this.imageFileService.fetchImageFilesById(activity.id, user.id);

      if (activityImage) {
        await Promise.all(
          activityImage.map(async (image) => {
            await this.imageUploadService.deleteUploadFile(image.key);
          }),
        );
      }

      await this.imageFileService.deleteImageFile(user.id, activity.id);

      await this.activityRepository.remove(activity);

      return { message: 'Activity deleted successfully' };
    } catch (err) {
      this.logService.error('Error deleting activity', err);
      throw new InternalServerErrorException('Could not delete activity');
    }
  }

  private async validateActivityCreation(
    userId: number,
    emailAddress: string,
    dto: CreateActivityDto,
    file?: Express.Multer.File[],
  ) {
    // Check subscription status
    const subscription = await this.subscriptionService.getUserSubscriptionInformation(
      emailAddress,
    );
    const isSubscriptionActive = subscription && subscription.status === SubscriptionStatus.active;

    // Count user's activities
    const activityCount = await this.activityRepository.count({ where: { user_id: userId } });

    // Restrict activity creation if subscription is not active and activity count is 5 or more
    if (!isSubscriptionActive && activityCount >= 5) {
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
        user_id: userId,
      },
    });

    if (existingActivity) {
      throw new ForbiddenException('Activity with this title already exists.');
    }
  }
}
