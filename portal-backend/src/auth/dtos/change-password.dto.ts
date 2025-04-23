import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password of user',
    example: 'OldPass12345',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password of user',
    example: 'NewPass12345',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
