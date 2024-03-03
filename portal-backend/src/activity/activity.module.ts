import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from '../upload/service/upload.service';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { ActivityController } from './controllers/activity.controller';
import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityService } from './service/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, UserAccountRepository, UploadService],
  exports: [ActivityRepository],
})
export class ActivityModule {}
