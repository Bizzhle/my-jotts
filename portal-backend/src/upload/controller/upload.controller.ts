import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../service/upload.service';
import { IsString } from 'class-validator';
import { Express } from 'express';

class DeleteDTO {
  @IsString()
  key: string;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.uploadService.upload(file);
  }

  @Delete()
  public async deleteFile(@Body() dto: DeleteDTO) {
    return await this.uploadService.deleteUploadFile(dto.key);
  }
}
