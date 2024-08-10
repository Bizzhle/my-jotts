import { Body, Controller, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../../users/dto/initial-login-response.dto';
import { UserAuthService } from '../services/userauth.service';
import { RefreshSessionDto } from '../../users/dto/refresh-session-response.dto';
import { IsAuthorizedUser } from '../guards/auth.guard';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { GetUidFromJWT } from '../../app/jwt.decorators';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Logs in a user' })
  @ApiOkResponse({
    description: 'User login successful',
  })
  @ApiBadRequestResponse({ description: 'user login failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async login(@Body() loginDto: LoginDto) {
    return await this.userAuthService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh a session' })
  @ApiOkResponse({
    description: 'User session refreshed',
  })
  @ApiBadRequestResponse({ description: 'user login failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async refreshsession(@Body() refreshSessionDto: RefreshSessionDto) {
    return await this.userAuthService.refreshSession(refreshSessionDto.refreshToken);
  }

  @IsAuthorizedUser()
  @Put('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({
    description: 'Password changed',
  })
  @ApiBadRequestResponse({ description: 'user password change failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  async changePassword(
    @GetUidFromJWT() userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userAuthService.changeUserPassword(userId, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'forgot user password' })
  @ApiOkResponse({
    description: 'Password changed',
  })
  @ApiBadRequestResponse({ description: 'user password change failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.userAuthService.forgotPassword(forgotPasswordDto.emailAddress);
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiOkResponse({
    description: 'Password reset',
  })
  @ApiBadRequestResponse({ description: 'User password reset failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userAuthService.resetPassword(resetPasswordDto);
  }
}
