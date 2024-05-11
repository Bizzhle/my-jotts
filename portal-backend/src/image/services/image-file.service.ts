import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ImageFile } from '../entities/image-file.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageFileService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFileRepository: Repository<ImageFile>,
  ) {}

  async storeImageFile(
    imageUrl: string,
    imageKey: string,
    activityId: number,
    userId: number,
  ): Promise<void> {
    const data: Partial<ImageFile> = {
      url: imageUrl,
      key: imageKey,
      activity_id: activityId,
      user_id: userId,
    };
    await this.imageFileRepository.save(data);
  }

  async deleteImageFile(userId: number, activityId: number): Promise<void> {
    const imageFile = await this.imageFileRepository.findOneBy({
      user_id: userId,
      activity_id: activityId,
    });

    if (!imageFile) throw new NotFoundException('Image file not found for given user and activity');

    await this.imageFileRepository.remove(imageFile);
  }

  async getImageFileById(activityId: number, userId: number) {
    const file = await this.imageFileRepository.findOneBy({
      activity_id: activityId,
      user_id: userId,
    });

    if (!file) {
      throw new NotFoundException('Image file does not exist');
    }

    return file;
  }
}
