import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SupportRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
}
