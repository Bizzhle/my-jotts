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
import { ActivityCreationFailedException } from '../exceptions/activity-creation-failed.exception';
import { ActivityRepository } from '../repositories/activity.repository';
import { ImageFileService } from '../../image/services/image-file.service';
import { ActivityResponseDto } from '../dto/response-dto/activityResponse.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly imageUploadService: UploadService,
    private readonly categoryService: CategoryService,
    private readonly imageFileService: ImageFileService,
  ) {}

  async createActivity(emailAddress: string, dto: CreateActivityDto, file?: Express.Multer.File) {
    let imageFile;

    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    if (!user) {
      throw new BadRequestException('User not logged in');
    }

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

    if (file) {
      imageFile = await this.imageUploadService.upload(file);
    }

    const activity = await this.activityRepository.createActivity(
      dto,
      user.id,
      category.id,
      imageFile.location,
    );
    if (imageFile) {
      await this.imageFileService.storeImageFile(
        imageFile.Location,
        imageFile.Key,
        activity.id,
        user.id,
      );

      activity.imageFile_url = imageFile.Location;
      await this.activityRepository.save(activity);
    }

    return activity;
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

    const activities = await this.activityRepository.geAllUserActivities(user.id);

    let activityResponse: ActivityResponseDto[] = [];

    for (const activity of activities) {
      let imageFile;
      if (activity.imageFile_url) {
        const { key } = await this.imageFileService.getImageFileById(activity.id, user.id);
        imageFile = await this.imageUploadService.getImageStreamFromS3(key);
      }

      activityResponse.push({
        activityTitle: activity.activity_title,
        categoryName: activity.category.category_name,
        location: activity.location,
        price: activity.price,
        rating: activity.rating,
        description: activity.description,
        dateCreated: activity.date_created,
        dateUpdated: activity.date_updated,
        image: imageFile,
      });
    }

    return activityResponse;
  }

  async getUserActivity(activityId: number, emailAddress: string): Promise<ActivityResponseDto> {
    let activityResponse: ActivityResponseDto;
    let imageFile;
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });
    const activity = await this.activityRepository.getActivityByUserIdAndActivityId(
      activityId,
      user.id,
    );

    if (activity.imageFile_url) {
      const { key } = await this.imageFileService.getImageFileById(activity.id, user.id);
      imageFile = await this.imageUploadService.getImageStreamFromS3(key);
    }

    return (activityResponse = {
      activityTitle: activity.activity_title,
      categoryName: activity.category.category_name,
      location: activity.location,
      price: activity.price,
      rating: activity.rating,
      description: activity.description,
      dateCreated: activity.date_created,
      dateUpdated: activity.date_updated,
      image: imageFile,
    });
  }

  async getUserActivitiesByCategory(categoryId: number, emailAddress: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    return await this.activityRepository.getUserActivitiesByCategory(categoryId, user.id);
  }

  async updateActivity(activityId: number, dto: UpdateActivityDto, emailAddress: string, file) {
    let imageUrl;
    if (file) {
      imageUrl = await this.imageUploadService.upload(file);
    }
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
      imageFile_url: imageUrl,
    };

    return await this.activityRepository.updateActivity(activity, activityData);
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

    if (activity.imageFile_url) {
      const activityImage = await this.imageFileService.getImageFileById(activity.id, user.id);

      await this.imageUploadService.deleteUploadFile(activityImage.key);

      await this.imageFileService.deleteImageFile(user.id, activity.id);
    }

    await this.activityRepository.remove(activity);

    return { message: 'Activity deleted successfully' };
  }
}
