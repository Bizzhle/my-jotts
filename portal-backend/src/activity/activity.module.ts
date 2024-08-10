import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { UploadService } from '../upload/service/upload.service';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { ActivityController } from './controllers/activity.controller';
import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityService } from './service/activity.service';
import { UploadModule } from '../upload/upload.module';
import { ImageModule } from '../image/image.module';
import { AppLoggerService } from '../logger/services/app-logger.service';
import { UtilsModule } from '../utils/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    CategoryModule,
    UploadModule,
    ImageModule,
    UtilsModule,
  ],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    ActivityRepository,
    UserAccountRepository,
    UploadService,
    AppLoggerService,
  ],
  exports: [ActivityRepository],
})
export class ActivityModule {}
