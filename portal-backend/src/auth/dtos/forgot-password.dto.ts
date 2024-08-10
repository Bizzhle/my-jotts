import { IsEmail, IsNotEmpty, IsString, IsUUID, Validate } from 'class-validator';
import { UserPasswordValidator } from '../../users/types/validators/user-password.validators';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}

export class ResetPasswordDto {
  @Validate(UserPasswordValidator)
  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
