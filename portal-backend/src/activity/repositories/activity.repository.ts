import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';

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
      .leftJoin('activity.subCategory', 'subCategory')
      .addSelect([
        'category.category_name',
        'category.id',
        'subCategory.category_name',
        'subCategory.id',
      ])
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
    const query = await this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .leftJoin('activity.subCategory', 'subCategory')
      .addSelect([
        'category.category_name',
        'category.id',
        'subCategory.category_name',
        'subCategory.id',
      ])
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.id = :activityId', { activityId })
      .getOne();

    return query;
  }

  async getUserActivitiesByCategoryId(
    categoryId: number,
    userId: string,
    startOffset: number,
    activityLimit: number,
  ) {
    // Fetch the category with its subcategories
    const category = await this.manager
      .getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :categoryId', { categoryId })
      .getOne();

    // Fetch activities for this category
    const activities = await this.createQueryBuilder('activity')
      .leftJoin('activity.category', 'category')
      .leftJoin('activity.subCategory', 'subCategory')
      .addSelect([
        'category.category_name',
        'category.id',
        'subCategory.category_name',
        'subCategory.id',
      ])
      .where('activity.userId = :userId', { userId })
      .andWhere('category.id = :categoryId OR subCategory.id = :categoryId', { categoryId })
      .skip(startOffset)
      .take(activityLimit)
      .orderBy('activity.date_created', 'DESC')
      .getMany();

    return { category, activities };
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
    subCategoryId?: number,
  ): Promise<Activity> {
    const activityData: Partial<Activity> = {
      activity_title: dto.activityTitle,
      category_id: categoryId,
      subCategoryId: subCategoryId ?? null,
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
