import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { QueueName } from './constants/queue.constants';

export interface DeadLetterEntry {
  sourceQueue: QueueName.EMAIL | QueueName.IMAGE_PROCESSING;
  sourceJobId: string;
  sourceJobName: string;
  attemptsMade: number;
  failedAt: string;
  failureSummary: string;
}

const DEAD_LETTER_JOB_NAME = 'exhausted-job';

@Injectable()
export class DeadLetterService {
  constructor(
    @InjectQueue(QueueName.DEAD_LETTER) private readonly deadLetterQueue: Queue<DeadLetterEntry>,
    @InjectQueue(QueueName.EMAIL) private readonly emailQueue: Queue,
    @InjectQueue(QueueName.IMAGE_PROCESSING) private readonly imageQueue: Queue,
  ) {}

  async recordFailure(
    sourceQueue: DeadLetterEntry['sourceQueue'],
    sourceJob: Job,
    error: Error,
  ): Promise<void> {
    if (sourceJob.id === undefined) {
      throw new Error('Cannot dead-letter a job without an ID');
    }

    const sourceJobId = String(sourceJob.id);
    const entry: DeadLetterEntry = {
      sourceQueue,
      sourceJobId,
      sourceJobName: sourceJob.name,
      attemptsMade: sourceJob.attemptsMade,
      failedAt: new Date().toISOString(),
      failureSummary: this.getSafeFailureSummary(error),
    };

    const deadLetterJob = await this.deadLetterQueue.add(DEAD_LETTER_JOB_NAME, entry, {
      jobId: `dlq-${encodeURIComponent(sourceQueue)}-${encodeURIComponent(sourceJobId)}`,
    });
    await deadLetterJob.updateData(entry);
  }

  async listEntries(): Promise<Array<{ id: string; data: DeadLetterEntry }>> {
    const jobs = await this.deadLetterQueue.getJobs(['waiting'], 0, 99);
    return jobs.map((job) => ({ id: String(job.id), data: job.data }));
  }

  async replay(deadLetterJobId: string): Promise<void> {
    const deadLetterJob = await this.getDeadLetterJob(deadLetterJobId);
    const sourceJob = await this.getSourceQueue(deadLetterJob.data.sourceQueue).getJob(
      deadLetterJob.data.sourceJobId,
    );

    if (!sourceJob) {
      throw new NotFoundException('The original failed job no longer exists');
    }

    const sourceState = await sourceJob.getState();
    if (sourceState !== 'failed') {
      throw new Error(`Cannot replay source job in state: ${sourceState}`);
    }

    await sourceJob.retry('failed', { resetAttemptsMade: true, resetAttemptsStarted: true });
  }

  async acknowledge(deadLetterJobId: string): Promise<void> {
    const deadLetterJob = await this.getDeadLetterJob(deadLetterJobId);
    const sourceJob = await this.getSourceQueue(deadLetterJob.data.sourceQueue).getJob(
      deadLetterJob.data.sourceJobId,
    );

    if (sourceJob) {
      const sourceState = await sourceJob.getState();
      if (!['failed', 'completed'].includes(sourceState)) {
        throw new Error(`Cannot acknowledge source job in state: ${sourceState}`);
      }
      if (sourceState === 'failed') {
        await sourceJob.remove();
      }
    }

    await deadLetterJob.remove();
  }

  private async getDeadLetterJob(id: string): Promise<Job<DeadLetterEntry>> {
    const job = await this.deadLetterQueue.getJob(id);
    if (!job) {
      throw new NotFoundException(`Dead-letter job not found: ${id}`);
    }
    return job;
  }

  private getSourceQueue(name: DeadLetterEntry['sourceQueue']): Queue {
    return name === QueueName.EMAIL ? this.emailQueue : this.imageQueue;
  }

  private getSafeFailureSummary(error: Error): string {
    const errorName = error.name.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 80) || 'Error';
    const errorCode =
      'code' in error && typeof error.code === 'string'
        ? error.code.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 40)
        : '';
    return errorCode ? `${errorName} (${errorCode})` : errorName;
  }
}
