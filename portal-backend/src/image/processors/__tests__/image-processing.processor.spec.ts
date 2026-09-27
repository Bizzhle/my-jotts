import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { ImageJobName } from '../../../queue/constants/queue.constants';
import { ImageProcessingStatus } from '../../enum/image-processing-status.enum';
import { ImageProcessingProcessor } from '../image-processing.processor';

jest.mock('@nestjs/bullmq', () => ({
  OnWorkerEvent: () => () => undefined,
  Processor: () => () => undefined,
  WorkerHost: class WorkerHost {},
}));

describe('ImageProcessingProcessor', () => {
  let processor: ImageProcessingProcessor;
  let imageCompressionService: { compress: jest.Mock };
  let uploadService: { upload: jest.Mock; deleteUploadFile: jest.Mock };
  let imageFileService: { updateImageFile: jest.Mock; deleteImageFileById: jest.Mock };
  let tempDirectory: string;

  beforeEach(async () => {
    tempDirectory = await mkdtemp(join(tmpdir(), 'image-processing-test-'));
    imageCompressionService = {
      compress: jest.fn().mockResolvedValue({
        buffer: Buffer.from('compressed'),
        mimeType: 'image/webp',
        extension: 'webp',
      }),
    };
    uploadService = {
      upload: jest.fn().mockResolvedValue({
        Location: 'https://bucket.s3.region.amazonaws.com/image.webp',
        Key: 'image.webp',
      }),
      deleteUploadFile: jest.fn().mockResolvedValue(undefined),
    };
    imageFileService = {
      updateImageFile: jest.fn().mockResolvedValue(undefined),
      deleteImageFileById: jest.fn().mockResolvedValue(undefined),
    };
    processor = new ImageProcessingProcessor(
      imageCompressionService as never,
      uploadService as never,
      imageFileService as never,
    );
  });

  afterEach(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it('compresses, uploads, updates the image row, and removes the temp file', async () => {
    const tempFilePath = join(tempDirectory, 'source.png');
    await writeFile(tempFilePath, Buffer.from('original'));

    await processor.process({
      name: ImageJobName.PROCESS_ACTIVITY_IMAGE_UPLOAD,
      data: {
        activityId: 17,
        imageFileId: 22,
        tempFilePath,
        userId: 'user-1',
        originalFilename: 'photo.png',
      },
      opts: { attempts: 3 },
      attemptsMade: 0,
    } as never);

    expect(imageCompressionService.compress).toHaveBeenCalledWith(Buffer.from('original'));
    expect(uploadService.upload).toHaveBeenCalledWith({
      activityId: 17,
      userId: 'user-1',
      file: {
        originalname: 'photo.webp',
        buffer: Buffer.from('compressed'),
        mimetype: 'image/webp',
      },
    });
    expect(imageFileService.updateImageFile).toHaveBeenLastCalledWith(22, {
      status: ImageProcessingStatus.COMPLETED,
      url: 'https://bucket.s3.region.amazonaws.com/image.webp',
      key: 'image.webp',
    });
    await expect(readFile(tempFilePath)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('retains the temp file for retry and marks the image failed after all attempts', async () => {
    const tempFilePath = join(tempDirectory, 'retry.png');
    await writeFile(tempFilePath, Buffer.from('original'));
    uploadService.upload.mockRejectedValueOnce(new Error('S3 unavailable'));
    const job = {
      id: 'job-1',
      name: ImageJobName.PROCESS_ACTIVITY_IMAGE_UPLOAD,
      data: {
        activityId: 17,
        imageFileId: 22,
        tempFilePath,
        userId: 'user-1',
        originalFilename: 'photo.png',
      },
      opts: { attempts: 3 },
      attemptsMade: 0,
    };

    await expect(processor.process(job as never)).rejects.toThrow('S3 unavailable');
    await expect(readFile(tempFilePath)).resolves.toEqual(Buffer.from('original'));

    await processor.handleFailedJob({ ...job, attemptsMade: 1 } as never, new Error('retrying'));
    expect(imageFileService.updateImageFile).not.toHaveBeenCalledWith(22, {
      status: ImageProcessingStatus.FAILED,
    });

    await processor.handleFailedJob({ ...job, attemptsMade: 3 } as never, new Error('exhausted'));
    expect(imageFileService.updateImageFile).toHaveBeenLastCalledWith(22, {
      status: ImageProcessingStatus.FAILED,
    });
  });

  it('deletes the S3 object before deleting the image row', async () => {
    await processor.process({
      name: ImageJobName.PROCESS_ACTIVITY_IMAGE_DELETE,
      data: { imageFileId: 22, key: 'image.webp' },
    } as never);

    expect(uploadService.deleteUploadFile).toHaveBeenCalledWith('image.webp');
    expect(imageFileService.deleteImageFileById).toHaveBeenCalledWith(22);
    expect(uploadService.deleteUploadFile.mock.invocationCallOrder[0]).toBeLessThan(
      imageFileService.deleteImageFileById.mock.invocationCallOrder[0],
    );
  });
});
