import { Injectable } from '@nestjs/common';
import { UploadService } from '../../upload/service/upload.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivityRepository } from '../repositories/activity.repository';

@Injectable()
export class ActivityService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly imageUploadService: UploadService,
  ) {}

  async createActivity(emailAddress: string, dto: CreateActivityDto, file?: Express.Multer.File) {
    let image;
    if (file) {
      image = await this.imageUploadService.upload(file);
    }

    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    return await this.activityRepository.createActivity(dto, user.id, image);
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

  async updateActivity(id: number, dto: UpdateActivityDto, emailAddress: string, file) {
    let image;
    if (file) {
      image = await this.imageUploadService.upload(file);
    }
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    return await this.activityRepository.updateActivity(id, dto, user.id, image);
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
