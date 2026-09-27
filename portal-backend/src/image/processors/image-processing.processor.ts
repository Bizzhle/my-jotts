import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { readFile, rm } from 'fs/promises';
import { parse } from 'path';
import { ImageJobName, QueueName } from '../../queue/constants/queue.constants';
import { UploadService } from '../../upload/service/upload.service';
import { ImageProcessingStatus } from '../enum/image-processing-status.enum';
import { ImageCompressionService } from '../services/image-compression.service';
import { ImageFileService } from '../services/image-file.service';

export interface ProcessActivityImageUploadPayload {
  activityId: number;
  imageFileId: number;
  tempFilePath: string;
  userId: string;
  originalFilename: string;
}

export interface ProcessActivityImageDeletePayload {
  imageFileId: number;
  key: string;
}

@Processor(QueueName.IMAGE_PROCESSING)
export class ImageProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageProcessingProcessor.name);

  constructor(
    private readonly imageCompressionService: ImageCompressionService,
    private readonly uploadService: UploadService,
    private readonly imageFileService: ImageFileService,
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    switch (job.name) {
      case ImageJobName.PROCESS_ACTIVITY_IMAGE_UPLOAD:
        return this.processUpload(job as Job<ProcessActivityImageUploadPayload>);
      case ImageJobName.PROCESS_ACTIVITY_IMAGE_DELETE:
        return this.processDelete(job as Job<ProcessActivityImageDeletePayload>);
      default:
        throw new Error(`Unknown image processing job: ${job.name}`);
    }
  }

  private async processUpload(job: Job<ProcessActivityImageUploadPayload>): Promise<void> {
    const { activityId, imageFileId, tempFilePath, userId, originalFilename } = job.data;
    let succeeded = false;

    try {
      await this.imageFileService.updateImageFile(imageFileId, {
        status: ImageProcessingStatus.PROCESSING,
      });

      const sourceBuffer = await readFile(tempFilePath);
      const compressed = await this.imageCompressionService.compress(sourceBuffer);
      const filename = parse(originalFilename);
      const upload = await this.uploadService.upload({
        activityId,
        userId,
        file: {
          originalname: `${filename.name}.${compressed.extension}`,
          buffer: compressed.buffer,
          mimetype: compressed.mimeType,
        },
      });

      await this.imageFileService.updateImageFile(imageFileId, {
        status: ImageProcessingStatus.COMPLETED,
        url: upload.Location,
        key: upload.Key,
      });
      succeeded = true;
    } finally {
      const attempts = job.opts.attempts ?? 1;
      const isFinalAttempt = job.attemptsMade + 1 >= attempts;
      if (succeeded || isFinalAttempt) {
        await rm(tempFilePath, { force: true }).catch((error: Error) => {
          this.logger.warn(`Unable to remove processed image temp file: ${error.message}`);
        });
      }
    }
  }

  private async processDelete(job: Job<ProcessActivityImageDeletePayload>): Promise<void> {
    await this.uploadService.deleteUploadFile(job.data.key);
    await this.imageFileService.deleteImageFileById(job.data.imageFileId);
  }

  @OnWorkerEvent('failed')
  async handleFailedJob(job: Job | undefined, error: Error): Promise<void> {
    if (!job || job.name !== ImageJobName.PROCESS_ACTIVITY_IMAGE_UPLOAD) {
      return;
    }

    const attempts = job.opts.attempts ?? 1;
    if (job.attemptsMade < attempts) {
      return;
    }

    const payload = job.data as ProcessActivityImageUploadPayload;
    this.logger.error(`Image upload job ${job.id} exhausted retries: ${error.message}`);
    await this.imageFileService.updateImageFile(payload.imageFileId, {
      status: ImageProcessingStatus.FAILED,
    });
  }
}
