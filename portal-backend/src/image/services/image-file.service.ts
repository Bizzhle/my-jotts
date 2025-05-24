import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageFile } from '../entities/image-file.entity';

@Injectable()
export class ImageFileService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFileRepository: Repository<ImageFile>,
  ) {}

  async storeImageFile(imageUrl: string, imageKey: string, activityId: number, userId: number) {
    const data: Partial<ImageFile> = {
      url: imageUrl,
      key: imageKey,
      activity_id: activityId,
      user_id: userId,
    };
    const image = await this.imageFileRepository.save(data);
    return image.url;
  }

  async deleteImageFile(userId: number, activityId: number): Promise<void> {
    const imageFile = await this.imageFileRepository.find({
      where: {
        user_id: userId,
        activity_id: activityId,
      },
    });

    await Promise.all(
      imageFile.map(async (image) => {
        await this.imageFileRepository.remove(image);
      }),
    );
  }

  async getImageFileById(activityId: number, userId: number) {
    const file = await this.imageFileRepository.findOneBy({
      activity_id: activityId,
      user_id: userId,
    });

    return file;
  }

  async fetchImageFilesById(activityId: number, userId: number) {
    const file = await this.imageFileRepository.find({
      where: {
        activity_id: activityId,
        user_id: userId,
      },
    });

    return file;
  }
}
