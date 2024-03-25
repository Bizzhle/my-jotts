import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../../category/services/category.service';
import { UploadService } from '../../upload/service/upload.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';
import { ActivityCreationFailedException } from '../exceptions/activity-creation-failed.exception';
import { ActivityRepository } from '../repositories/activity.repository';

@Injectable()
export class ActivityService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly imageUploadService: UploadService,
    private readonly categoryService: CategoryService,
  ) {}

  async createActivity(emailAddress: string, dto: CreateActivityDto, file?: Express.Multer.File) {
    try {
      let image;
      if (file) {
        image = await this.imageUploadService.upload(file);
      }

      const user = await this.userAccountRepository.findOne({
        where: {
          email_address: emailAddress,
        },
      });

      let category = await this.categoryService.getCategoryByName(dto.categoryName, user.id);
      if (!category) {
        category = await this.categoryService.createCategory(
          { categoryName: dto.categoryName },
          user.email_address,
        );
      }

      return await this.activityRepository.createActivity(dto, user.id, category.id, image);
    } catch (err) {
      throw new ActivityCreationFailedException('could not create activity', err);
    }
  }

  async getAllUserActivities(emailAddress: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });
    return await this.activityRepository.geAllUserActivities(user.id);
  }

  async getUserActivity(activityId: number, emailAddress: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });
    return await this.activityRepository.getActivityByUserIdAndActivityId(activityId, user.id);
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
    let image;
    if (file) {
      image = await this.imageUploadService.upload(file);
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
      image: image,
    };

    return await this.activityRepository.updateActivity(activity, activityData);
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
