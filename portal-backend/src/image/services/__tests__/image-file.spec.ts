import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { Repository } from 'typeorm/repository/Repository';
import { UploadService } from '../../../upload/service/upload.service';
import { ImageFile } from '../../entities/image-file.entity';
import { ImageFileService } from '../image-file.service';

describe('ImageFileService', () => {
  let service: ImageFileService;
  let imageFileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageFileService,
        {
          provide: getRepositoryToken(ImageFile),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: UploadService,
          useValue: {
            upload: jest.fn(),
            deleteUploadFile: jest.fn(),
            getImageStreamFromS3: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImageFileService>(ImageFileService);
    imageFileRepository = module.get<Repository<ImageFile>>(getRepositoryToken(ImageFile));
  });

  describe('storeImageFile', () => {
    it('should create and save an image file', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' } as any;
      const mockImageFile = {
        id: 1,
        url: 'https://s3.amazonaws.com/bucket/image.jpg',
        key: 'uploads/image-123.jpg',
        activity_id: 456,
        user: mockUser,
        created_at: new Date(),
        updated_at: new Date(),
      };

      imageFileRepository.create.mockReturnValue(mockImageFile);
      imageFileRepository.save.mockResolvedValue(mockImageFile);

      const result = await service.storeImageFile(
        'https://s3.amazonaws.com/bucket/image.jpg',
        'uploads/image-123.jpg',
        456,
        mockUser,
      );

      expect(imageFileRepository.create).toHaveBeenCalledWith({
        url: 'https://s3.amazonaws.com/bucket/image.jpg',
        key: 'uploads/image-123.jpg',
        activity_id: 456,
        user: mockUser,
      });
      expect(imageFileRepository.save).toHaveBeenCalledWith(mockImageFile);
      expect(result).toEqual(mockImageFile);
    });
  });

  describe('deleteImageFile', () => {
    it('should find and delete all image files for a user and activity', async () => {
      const mockUser = { id: 'user-123' } as any;
      const mockImageFiles = [
        { id: 1, url: 'image1.jpg', key: 'key1', activity_id: 456, user: mockUser },
        { id: 2, url: 'image2.jpg', key: 'key2', activity_id: 456, user: mockUser },
      ];

      imageFileRepository.find.mockResolvedValue(mockImageFiles);
      imageFileRepository.remove.mockResolvedValue(undefined);

      await service.deleteImageFile('user-123', 456);

      expect(imageFileRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: 'user-123' },
          activity_id: 456,
        },
      });
      expect(imageFileRepository.remove).toHaveBeenCalledTimes(2);
      expect(imageFileRepository.remove).toHaveBeenCalledWith(mockImageFiles[0]);
      expect(imageFileRepository.remove).toHaveBeenCalledWith(mockImageFiles[1]);
    });

    it('should handle empty result when no images found', async () => {
      imageFileRepository.find.mockResolvedValue([]);

      await service.deleteImageFile('user-123', 456);

      expect(imageFileRepository.find).toHaveBeenCalled();
      expect(imageFileRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('getImageFileById', () => {
    it('should return a single image file by activity and user', async () => {
      const mockUser = { id: 'user-123' } as any;
      const mockImageFile = {
        id: 1,
        url: 'image.jpg',
        key: 'key',
        activity_id: 456,
        user: mockUser,
      };

      imageFileRepository.findOneBy.mockResolvedValue(mockImageFile);

      const result = await service.getImageFileById(456, 'user-123');

      expect(imageFileRepository.findOneBy).toHaveBeenCalledWith({
        activity_id: 456,
        user: { id: 'user-123' },
      });
      expect(result).toEqual(mockImageFile);
    });

    it('should return null when image file not found', async () => {
      imageFileRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getImageFileById(999, 'user-123');

      expect(result).toBeNull();
    });
  });

  describe('fetchImageFilesById', () => {
    it('should return all image files for an activity and user', async () => {
      const mockUser = { id: 'user-123' } as any;
      const mockImageFiles = [
        { id: 1, url: 'image1.jpg', key: 'key1', activity_id: 456, user: mockUser },
        { id: 2, url: 'image2.jpg', key: 'key2', activity_id: 456, user: mockUser },
        { id: 3, url: 'image3.jpg', key: 'key3', activity_id: 456, user: mockUser },
      ];

      imageFileRepository.find.mockResolvedValue(mockImageFiles);

      const result = await service.fetchImageFilesById(456, 'user-123');

      expect(imageFileRepository.find).toHaveBeenCalledWith({
        where: {
          activity_id: 456,
          user: { id: 'user-123' },
        },
      });
      expect(result).toEqual(mockImageFiles);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no images found', async () => {
      imageFileRepository.find.mockResolvedValue([]);

      const result = await service.fetchImageFilesById(999, 'user-123');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
