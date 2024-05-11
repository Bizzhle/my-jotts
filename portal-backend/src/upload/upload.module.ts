import { Module } from '@nestjs/common';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './service/upload.service';
import { AppLoggerService } from '../logger/services/app-logger.service';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [UploadService, AppLoggerService],
  exports: [UploadService],
})
export class UploadModule {}
