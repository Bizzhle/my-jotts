import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { UserPasswordValidator } from '../../users/types/validators/user-password.validators';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email Address',
    example: 'test@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password of user',
    example: 'NewPass12345',
  })
  @Validate(UserPasswordValidator)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'Token to reset password',
    example: '1234567890abcdef',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
