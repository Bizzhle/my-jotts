import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryService } from '../../category/services/category.service';
import { UploadService } from '../../upload/service/upload.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';
import { ActivityRepository } from '../repositories/activity.repository';
import { ImageFileService } from '../../image/services/image-file.service';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';
import { WithTransactionService } from '../../app/services/with-transaction.services';
import { DataSource } from 'typeorm';
import { AppLoggerService } from '../../logger/services/app-logger.service';

@Injectable()
export class ActivityService extends WithTransactionService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly imageUploadService: UploadService,
    private readonly categoryService: CategoryService,
    private readonly imageFileService: ImageFileService,
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

      const existingActivity = await this.activityRepository.findOne({
        where: {
          activity_title: dto.activityTitle,
          user_id: user.id,
        },
      });

      if (existingActivity) {
        throw new BadRequestException('Activity with this title already exists.');
      }

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);

      if (!category) {
        category = await this.categoryService.createCategory(
          { categoryName: dto.categoryName },
          user.email_address,
        );
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

        const imageFiles = await Promise.all(
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

      return savedActivity;
    } catch (err) {
      await transaction.rollbackTransaction();
      await this.logService.debug(err);
      throw new BadRequestException('Could not create activity', err);
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  async getAllUserActivities(emailAddress: string): Promise<ActivityResponseDto[]> {
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    if (!user) {
      throw new BadRequestException('User not logged in');
    }

    const activities = await this.activityRepository.getAllUserActivities(user.id);

    let activityResponse: ActivityResponseDto[] = [];

    for (const activity of activities) {
      const imageFile = await this.imageFileService.getImageFileById(activity.id, user.id);
      const imageUrls = imageFile.map((image) => image.url);

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
        imageUrls: imageUrls,
      });
    }

    return activityResponse;
  }

  async getUserActivity(activityId: number, emailAddress: string): Promise<ActivityResponseDto> {
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

    const imageFile = await this.imageFileService.getImageFileById(activity.id, user.id);
    const imageUrls = imageFile.map((image) => image.url);

    //imageFile = await this.imageUploadService.getImageStreamFromS3(key);

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
      const imageUrls = imageFile.map((image) => image.url);

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
        imageUrls: imageUrls,
      });
    }

    return activityResponse;
  }

  async updateActivity(
    activityId: number,
    dto: UpdateActivityDto,
    emailAddress: string,
    files: Express.Multer.File[],
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

        const imageFiles = await Promise.all(
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
      throw new BadRequestException('Could not update activity', err);
    }
  }

  async deleteActivity(activityId: number, emailAddress: string) {
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

    const activityImage = await this.imageFileService.getImageFileById(activity.id, user.id);

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
  }
}
