import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { GetCurrentUserEmail } from 'src/app/decorators/jwt.decorators';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/forgot-password.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpDto } from '../dtos/signup.dto';
import { IsAuthorizedUser } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @AllowAnonymous()
  async signup(@Body() dto: SignUpDto) {
    await this.authService.signup(dto);
    // return res.status(201).json(result);
  }

  @Post('sign-in')
  @AllowAnonymous()
  async signin(@Body() dto: SignInDto) {
    return await this.authService.signin(dto);
  }

  @Post('sign-out')
  async signout(@Req() req: Request) {
    const headers = req.headers;
    return await this.authService.signout(headers);
  }

  @IsAuthorizedUser()
  @Get('me')
  async getUser(@GetCurrentUserEmail() email: string) {
    return await this.authService.getUserData(email);
  }

  @Post('validate-user')
  @AllowAnonymous()
  async validateUser(@Body() dto: SignInDto) {
    return await this.authService.validateUser(dto.email);
  }

  @Post('forgot-password')
  @AllowAnonymous()
  async requestPasswordReset(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestResetPassword(dto);
  }

  @Post('reset-password')
  @AllowAnonymous()
  async confirmPasswordReset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
