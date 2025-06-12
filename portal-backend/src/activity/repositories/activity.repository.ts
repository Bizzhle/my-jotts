import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';

type CreateActivity = Omit<CreateActivityDto, 'category'>;

@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(ds: DataSource) {
    super(Activity, ds.manager);
  }

  async getAllUserActivities(
    userId: number,
    search: string,
    startOffset: number,
    activityLimit: number,
  ) {
    const query = await this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name', 'category.id'])
      .skip(startOffset)
      .take(activityLimit)
      .orderBy('activity.date_created', 'DESC')
      .where('activity.user_id = :userId', { userId });

    if (search) {
      query.where('activity.activity_title ILIKE :name', { name: `%${search}%` });
    }

    return query.getMany();
  }

  async getActivityCount(filter?: string, userId?: number): Promise<number> {
    const query = this.createQueryBuilder('activity').where('activity.user_id = :userId', {
      userId,
    });

    if (filter) {
      query.andWhere('activity.activity_title ILIKE :filter', { filter: `%${filter}%` });
    }

    return query.getCount();
  }

  async getActivityByUserIdAndActivityId(activityId: number, userId: number) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('activity.id = :activityId', { activityId })
      .getOne();
  }

  async getUserActivitiesByCategory(
    categoryId: number,
    userId: number,
    startOffset: number,
    activityLimit: number,
  ) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.user_id = :userId', { userId })
      .andWhere('category.id = :categoryId', { categoryId })
      .skip(startOffset)
      .take(activityLimit)
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
