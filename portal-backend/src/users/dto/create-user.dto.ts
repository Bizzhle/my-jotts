import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { UserPasswordValidator } from '../types/validators/user-password.validators';

export class CreateUserDto {
  @ApiProperty({ description: 'Email Address', example: 'test@gmail.com' })
  @IsEmail(undefined)
  emailAddress: string;

  @ApiProperty({ description: 'user first name', example: 'Testfirstname' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'user last name', example: 'Testlastname' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'password of user', example: 'Pass12345' })
  // @Validate(UserPasswordValidator)
  @IsNotEmpty()
  password: string;
}
// export class LoginDto
