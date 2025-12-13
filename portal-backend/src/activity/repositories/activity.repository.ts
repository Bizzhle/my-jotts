import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';

type CreateActivity = Omit<CreateActivityDto, 'category'>;

@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(ds: DataSource) {
    super(Activity, ds.manager);
  }

  async getAllUserActivities(
    userId: string,
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
      .where('activity.userId = :userId', { userId });

    if (search) {
      query.where('activity.activity_title ILIKE :name', { name: `%${search}%` });
    }

    return query.getMany();
  }

  async getActivityCount(filter?: string, userId?: string): Promise<number> {
    const query = this.createQueryBuilder('activity').where('activity.userId = :userId', {
      userId,
    });

    if (filter) {
      query.andWhere('activity.activity_title ILIKE :filter', { filter: `%${filter}%` });
    }

    return query.getCount();
  }

  async getActivityByUserIdAndActivityId(activityId: number, userId: string) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.id = :activityId', { activityId })
      .getOne();
  }

  async getUserActivitiesByCategory(
    categoryId: number,
    userId: string,
    startOffset: number,
    activityLimit: number,
  ) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.userId = :userId', { userId })
      .andWhere('category.id = :categoryId', { categoryId })
      .skip(startOffset)
      .take(activityLimit)
      .getMany();
  }

  async getUserActivitiesByCategoryName(categoryName: string, userId: number) {
    return this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .select(['activity', 'category.category_name'])
      .where('activity.userId = :userId', { userId })
      .andWhere('LOWER(category.name) = LOWER(:categoryName)', { categoryName })
      .getMany();
  }

  async updateActivity(
    activity: Activity,
    dto: UpdateActivityDto,
    categoryId: number,
  ): Promise<Activity> {
    const activityData: Partial<Activity> = {
      activity_title: dto.activityTitle,
      category_id: categoryId,
      price: dto.price,
      location: dto.location,
      rating: dto.rating,
      description: dto.description,
      date_updated: new Date(),
    };

    Object.assign(activity, activityData);
    activity.date_updated = new Date();

    return this.save(activity);
  }
}
