import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';

type CreateActivity = Omit<CreateActivityDto, 'category'>;

interface activityOptions {
  take?: number;
  order?: { [key: string]: 'ASC' | 'DESC' };
}
@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(ds: DataSource) {
    super(Activity, ds.manager);
  }

  async getAllUserActivities(userId: number, search: string, options?: activityOptions) {
    const query = await this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name', 'category.id'])
      .where('activity.user_id = :userId', { userId });

    if (search) {
      query.where('activity.activity_title ILIKE :name', { name: `%${search}%` });
    }

    if (options) {
      query.limit(options.take);
      query.orderBy(options.order);
    }

    return query.getMany();
  }

  async getActivityByUserIdAndActivityId(activityId: number, userId: number) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('activity.id = :activityId', { activityId })
      .getOne();
  }

  async getUserActivitiesByCategory(categoryId: number, userId: number) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('category.id = :categoryId', { categoryId })
      .getMany();
  }

  async getUserActivitiesByCategoryName(categoryName: string, userId: number) {
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
