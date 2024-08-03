import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class logoutUserDto {
  @ApiProperty({ description: 'refresh token to revoke session' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  refreshToken: string;
}
