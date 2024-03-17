import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { Activity } from '../entities/activity.entity';

@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(ds: DataSource) {
    super(Activity, ds.manager);
  }

  public async createActivity(
    dto: CreateActivityDto,
    userid: number,
    image?: string,
  ): Promise<Activity> {
    const activity = this.create({
      title: dto.title,
      category_id: dto.categoryId,
      price: dto.price,
      location: dto.location,
      rating: dto.rating,
      content: dto.content,
      image: image,
      date_created: new Date(),
      user_id: userid,
      ...dto,
    });
    await this.save<Activity>(activity);

    return activity;
  }

  async geAllUserActivities(userId: number): Promise<Activity[]> {
    return await this.find({
      where: { user_id: userId },
    });
  }

  async getActivityByUserIdAndActivityId(activityId: number, userId: number): Promise<Activity> {
    return await this.findOne({
      where: {
        id: activityId,
        user_id: userId,
      },
    });
  }

  async getUserActivitiesByCategory(categoryId: number, userId: number): Promise<Activity[]> {
    return this.find({
      where: { category_id: categoryId, user_id: userId },
    });
  }

  async updateActivity(id: number, dto: UpdateActivityDto, userId: number, image: string) {
    return await this.update(
      {
        id: id,
        user_id: userId,
      },
      {
        title: dto.title,
        category_id: dto.categoryId,
        price: dto.price,
        location: dto.location,
        rating: dto.rating,
        content: dto.content,
        image: image,
      },
    );
  }
}
