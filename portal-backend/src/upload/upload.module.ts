import { Module } from '@nestjs/common';
import { AppLoggerService } from '../logger/services/app-logger.service';
import { UtilsModule } from '../utils/util.module';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './service/upload.service';

@Module({
  imports: [UtilsModule],
  controllers: [UploadController],
  providers: [UploadService, AppLoggerService],
  exports: [UploadService],
})
export class UploadModule {}
