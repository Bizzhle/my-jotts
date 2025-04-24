import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyRegistrationDto {
  @ApiProperty({
    description: 'Email Address',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  verificationToken: string;
}
