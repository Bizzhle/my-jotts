import { HttpException, Inject, Injectable } from '@nestjs/common';
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

  async deleteImageFile(imageId: number): Promise<void> {
    try {
      await this.imageFileRepository.delete(imageId);
    } catch (err) {
      throw new HttpException('Cannot delete Image', err);
    }
  }

  async getImageFileById(id: number) {
    const file = await this.imageFileRepository.findOneBy({ id: id });

    return file;
  }
}
