import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/User.entity';
import { Repository } from 'typeorm';
import { ImageFile } from '../entities/image-file.entity';

@Injectable()
export class ImageFileService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFileRepository: Repository<ImageFile>,
  ) {}

  async storeImageFile(imageUrl: string, imageKey: string, activityId: number, user: User) {
    const data: Partial<ImageFile> = {
      url: imageUrl,
      key: imageKey,
      activity_id: activityId,
      user,
    };
    const image = await this.imageFileRepository.save(data);
    return image.url;
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
}
