import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ImageJobName, QueueName } from '../../queue/constants/queue.constants';
import {
  ProcessActivityImageDeletePayload,
  ProcessActivityImageUploadPayload,
} from '../processors/image-processing.processor';

const DEFAULT_JOB_OPTS = { attempts: 3, backoff: { type: 'exponential', delay: 2000 } };

@Injectable()
export class ImageQueueService {
  constructor(@InjectQueue(QueueName.IMAGE_PROCESSING) private readonly queue: Queue) {}

  async enqueueImageUpload(payload: ProcessActivityImageUploadPayload): Promise<void> {
    await this.queue.add(ImageJobName.PROCESS_ACTIVITY_IMAGE_UPLOAD, payload, DEFAULT_JOB_OPTS);
  }

  async enqueueImageDelete(payload: ProcessActivityImageDeletePayload): Promise<void> {
    await this.queue.add(ImageJobName.PROCESS_ACTIVITY_IMAGE_DELETE, payload, DEFAULT_JOB_OPTS);
  }
}
