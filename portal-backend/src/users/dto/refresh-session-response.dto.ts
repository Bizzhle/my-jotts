import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshSessionResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class RefreshSessionDto {
  @ApiProperty({
    description: 'The refresh token used to refresh the session',
    example: '597fe989-03a2-46cf-a4bb-2f5b7f0175bb',
  })
  @IsNotEmpty()
  @IsUUID()
  refreshToken: string;
}
