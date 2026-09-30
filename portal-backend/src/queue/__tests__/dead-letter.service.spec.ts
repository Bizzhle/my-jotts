import { QueueName } from '../constants/queue.constants';
import { DeadLetterEntry, DeadLetterService } from '../dead-letter.service';

jest.mock('@nestjs/bullmq', () => ({
  InjectQueue: () => () => undefined,
}));

describe('DeadLetterService', () => {
  let service: DeadLetterService;
  let deadLetterQueue: {
    add: jest.Mock;
    getJobs: jest.Mock;
    getJob: jest.Mock;
  };
  let emailQueue: { getJob: jest.Mock };
  let imageQueue: { getJob: jest.Mock };
  let deadLetterJob: { updateData: jest.Mock };

  beforeEach(() => {
    deadLetterJob = { updateData: jest.fn().mockResolvedValue(undefined) };
    deadLetterQueue = {
      add: jest.fn().mockResolvedValue(deadLetterJob),
      getJobs: jest.fn().mockResolvedValue([]),
      getJob: jest.fn(),
    };
    emailQueue = { getJob: jest.fn() };
    imageQueue = { getJob: jest.fn() };
    service = new DeadLetterService(
      deadLetterQueue as never,
      emailQueue as never,
      imageQueue as never,
    );
  });

  it('stores only safe failure metadata and uses a deterministic DLQ job ID', async () => {
    const sourceJob = {
      id: 'email-job-9',
      name: 'send-password-reset',
      attemptsMade: 3,
      data: { to: 'user@example.com', resetLink: 'https://app/reset?token=secret' },
    };

    await service.recordFailure(
      QueueName.EMAIL,
      sourceJob as never,
      new Error('SMTP rejected user@example.com token=secret'),
    );
    await service.recordFailure(
      QueueName.EMAIL,
      sourceJob as never,
      new Error('SMTP failed again'),
    );

    const [name, data, options] = deadLetterQueue.add.mock.calls[0];
    expect(name).toBe('exhausted-job');
    expect(data).toMatchObject({
      sourceQueue: QueueName.EMAIL,
      sourceJobId: 'email-job-9',
      sourceJobName: 'send-password-reset',
      attemptsMade: 3,
      failureSummary: 'Error',
    });
    expect(data).not.toHaveProperty('to');
    expect(data).not.toHaveProperty('resetLink');
    expect(JSON.stringify(data)).not.toContain('secret');
    expect(options.jobId).toBe('dlq-email-email-job-9');
    expect(deadLetterQueue.add.mock.calls[1][2].jobId).toBe(options.jobId);
    expect(deadLetterJob.updateData).toHaveBeenCalledTimes(2);
  });

  it('lists only safe DLQ metadata', async () => {
    const data: DeadLetterEntry = {
      sourceQueue: QueueName.IMAGE_PROCESSING,
      sourceJobId: 'image-job-2',
      sourceJobName: 'process-activity-image-upload',
      attemptsMade: 3,
      failedAt: '2026-09-27T00:00:00.000Z',
      failureSummary: 'Error (EIO)',
    };
    deadLetterQueue.getJobs.mockResolvedValue([{ id: 'dlq-entry-2', data }]);

    await expect(service.listEntries()).resolves.toEqual([{ id: 'dlq-entry-2', data }]);
    expect(deadLetterQueue.getJobs).toHaveBeenCalledWith(['waiting'], 0, 99);
  });

  it('retries the original failed job with its attempt counters reset', async () => {
    const sourceJob = {
      getState: jest.fn().mockResolvedValue('failed'),
      retry: jest.fn().mockResolvedValue(undefined),
    };
    deadLetterQueue.getJob.mockResolvedValue({
      data: { sourceQueue: QueueName.EMAIL, sourceJobId: 'email-job-9' },
    });
    emailQueue.getJob.mockResolvedValue(sourceJob);

    await service.replay('dlq-entry-9');

    expect(sourceJob.retry).toHaveBeenCalledWith('failed', {
      resetAttemptsMade: true,
      resetAttemptsStarted: true,
    });
  });

  it('acknowledges a discarded failed source job and its DLQ entry', async () => {
    const sourceJob = {
      getState: jest.fn().mockResolvedValue('failed'),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const deadLetterJob = {
      data: { sourceQueue: QueueName.IMAGE_PROCESSING, sourceJobId: 'image-job-4' },
      remove: jest.fn().mockResolvedValue(undefined),
    };
    deadLetterQueue.getJob.mockResolvedValue(deadLetterJob);
    imageQueue.getJob.mockResolvedValue(sourceJob);

    await service.acknowledge('dlq-entry-4');

    expect(sourceJob.remove).toHaveBeenCalled();
    expect(deadLetterJob.remove).toHaveBeenCalled();
  });

  it('retains the source job while it is being replayed', async () => {
    const sourceJob = { getState: jest.fn().mockResolvedValue('active') };
    const deadLetterJob = {
      data: { sourceQueue: QueueName.EMAIL, sourceJobId: 'email-job-9' },
      remove: jest.fn(),
    };
    deadLetterQueue.getJob.mockResolvedValue(deadLetterJob);
    emailQueue.getJob.mockResolvedValue(sourceJob);

    await expect(service.acknowledge('dlq-entry-9')).rejects.toThrow(
      'Cannot acknowledge source job in state: active',
    );
    expect(deadLetterJob.remove).not.toHaveBeenCalled();
  });
});
