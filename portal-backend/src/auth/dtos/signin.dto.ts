import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Email Address', example: 'test@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'strongpassword' })
  @IsNotEmpty()
  password: string;
}
