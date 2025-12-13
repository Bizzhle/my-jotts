import { Body, Controller, Delete } from '@nestjs/common';
import { IsString } from 'class-validator';
import { UploadService } from '../service/upload.service';

class DeleteDTO {
  @IsString()
  key: string;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Delete()
  public async deleteFile(@Body() dto: DeleteDTO) {
    return await this.uploadService.deleteUploadFile(dto.key);
  }
}
