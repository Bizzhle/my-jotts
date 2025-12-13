import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/User.entity';
import { Repository } from 'typeorm';
import { UploadService } from '../../upload/service/upload.service';
import { ImageFile } from '../entities/image-file.entity';

@Injectable()
export class ImageFileService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFileRepository: Repository<ImageFile>,
    private readonly imageUploadService: UploadService,
  ) {}

  async storeImageFile(imageUrl: string, imageKey: string, activityId: number, user: User) {
    const imageFile = this.imageFileRepository.create({
      url: imageUrl,
      key: imageKey,
      activity_id: activityId,
      user,
    });
    const image = await this.imageFileRepository.save(imageFile);
    return image;
  }

  async deleteImageFile(userId: string, activityId: number): Promise<void> {
    const imageFile = await this.imageFileRepository.find({
      where: {
        user: { id: userId },
        activity_id: activityId,
      },
    });

    await Promise.all(
      imageFile.map(async (image) => {
        await this.imageFileRepository.remove(image);
      }),
    );
  }

  async getImageFileById(activityId: number, userId: string) {
    const file = await this.imageFileRepository.findOneBy({
      activity_id: activityId,
      user: { id: userId },
    });

    return file;
  }

  async fetchImageFilesById(activityId: number, userId: string) {
    const file = await this.imageFileRepository.find({
      where: {
        activity_id: activityId,
        user: { id: userId },
      },
    });

    return file;
  }

  async fetchImageFilesByActivityIds(activityIds: number[], userId: string): Promise<ImageFile[]> {
    const files = await this.imageFileRepository
      .createQueryBuilder('imageFile')
      .where('imageFile.activity_id IN (:...activityIds)', { activityIds })
      .andWhere('imageFile.userId = :userId', { userId })
      .getMany();

    return await Promise.all(
      files.map(async (img) => ({
        ...img,
        signedUrl: await this.imageUploadService.getImageStreamFromS3(img.key),
      })),
    );
  }

  async deleteSingleImageFile(imageFile: ImageFile): Promise<void> {
    await this.imageFileRepository.remove(imageFile);
  }
}
