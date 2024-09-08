import { Injectable } from '@nestjs/common';
import { pick, pickBy } from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';

type CreateActivity = Omit<CreateActivityDto, 'category'>;
@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(ds: DataSource) {
    super(Activity, ds.manager);
  }

  // public async createActivity(
  //   dto: CreateActivity,
  //   userId: number,
  //   categoryId: number,
  //   image?: string,
  // ) {
  //   const activity = this.create({
  //     activity_title: dto.activityTitle,
  //     category_id: categoryId,
  //     price: dto.price,
  //     location: dto.location,
  //     rating: dto.rating,
  //     description: dto.description,
  //     date_created: new Date(),
  //     user_id: userId,
  //     imageFiles: image
  //   });
  //   await this.save<Activity>(activity);

  //   return activity;
  // }

  async getAllUserActivities(userId: number): Promise<Activity[]> {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .getMany();
  }

  async getActivityByUserIdAndActivityId(activityId: number, userId: number) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('activity.id = :activityId', { activityId })
      .getOne();
  }

  async getUserActivitiesByCategory(categoryId: number, userId: number): Promise<Activity[]> {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('category.id = :categoryId', { categoryId })
      .getMany();
  }

  async getUserActivitiesByCategoryName(categoryName: string, userId: number): Promise<Activity[]> {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('LOWER(category.name) = LOWER(:categoryName)', { categoryName })
      .getMany();
  }

  async updateActivity(activity: Activity, data: Partial<Activity>): Promise<Activity> {
    const updatableFields = [
      'activity_title',
      'category_id',
      'price',
      'rating',
      'description',
      'image',
      'location',
      'date_updated',
    ];
    const updatedData = pick(data, updatableFields);

    if (data.category_id !== undefined) {
      activity.category_id = data.category_id;
    }

    Object.assign(activity, updatedData);
    activity.date_updated = new Date();

    return this.save(activity);
  }
}
