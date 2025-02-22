import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class OptionalFileValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File[] | undefined, metadata: ArgumentMetadata) {
    if (!value || value.length === 0) {
      return undefined;
    }

    const maxSizeValidator = new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 });
    const fileTypeValidator = new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|webp)$/i });

    for (const file of value) {
      try {
        await maxSizeValidator.isValid(file);
        await fileTypeValidator.isValid(file);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    return value;
  }
}
