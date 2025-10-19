import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/forgot-password.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpDto } from '../dtos/signup.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up/email')
  @AllowAnonymous()
  async signup(@Body() dto: SignUpDto) {
    await this.authService.signup(dto);
    // return res.status(201).json(result);
  }

  @Post('sign-in/email')
  @AllowAnonymous()
  async signin(@Body() dto: SignInDto) {
    await this.authService.signin(dto);
  }

  @Post('sign-out')
  async signout(@Req() req: Request) {
    const headers = req.headers;
    return await this.authService.signout(headers);
  }

  @Post('validate-user')
  @AllowAnonymous()
  async validateUser(@Body() dto: SignInDto) {
    return await this.authService.validateUser(dto.email);
  }

  @Post('password-reset/request')
  @AllowAnonymous()
  async requestPasswordReset(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestResetPassword(dto);
  }

  @Post('password-reset/confirm')
  @AllowAnonymous()
  async confirmPasswordReset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
