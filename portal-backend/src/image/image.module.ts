import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFile } from './entities/image-file.entity';
import { ImageFileService } from './services/image-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageFile])],
  providers: [ImageFileService],
  exports: [ImageFileService],
})
export class ImageModule {}
