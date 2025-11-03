import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'Email Address', example: 'test@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'strongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Name', example: 'John Doe' })
  @IsNotEmpty()
  name: string;
}
