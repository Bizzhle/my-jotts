import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';
import { AppLoggerService } from '../logger/services/app-logger.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UploadService } from '../upload/service/upload.service';
import { UploadModule } from '../upload/upload.module';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { UsersService } from '../users/services/user-service/users.service';
import { UtilsModule } from '../utils/util.module';
import { ActivityController } from './controllers/activity.controller';
import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityService } from './service/activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    CategoryModule,
    UploadModule,
    ImageModule,
    UtilsModule,
    SubscriptionModule,
  ],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    ActivityRepository,
    UserAccountRepository,
    UploadService,
    AppLoggerService,
    UsersService,
  ],
  exports: [ActivityRepository],
})
export class ActivityModule {}
