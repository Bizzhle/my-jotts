import { ApiProperty } from '@nestjs/swagger';

interface UploadFileInput {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to be uploaded',
  })
  file: UploadFileInput;

  @ApiProperty({
    type: 'string',
    description: 'The ID of the user uploading the file',
  })
  userId: string;

  @ApiProperty({
    type: 'number',
    description: 'The ID of the activity associated with the file',
  })
  activityId: number;
}
