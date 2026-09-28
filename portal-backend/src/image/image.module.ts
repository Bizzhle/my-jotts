import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from '../upload/service/upload.service';
import { ImageFile } from './entities/image-file.entity';
import { ImageProcessingProcessor } from './processors/image-processing.processor';
import { ImageCompressionService } from './services/image-compression.service';
import { ImageFileService } from './services/image-file.service';
import { ImageQueueService } from './services/image-queue.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageFile])],
  providers: [
    ImageFileService,
    ImageCompressionService,
    ImageProcessingProcessor,
    ImageQueueService,
    UploadService,
  ],
  exports: [ImageFileService, ImageQueueService],
})
export class ImageModule {}
