import { Body, Controller, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { logoutUserDto } from 'src/users/dto/logout-user.dto';
import { UserLogoutService } from 'src/users/services/user-service/user-logout.service';
import { GetUidFromJWT } from '../../app/jwt.decorators';
import { LoginDto } from '../../users/dto/initial-login-response.dto';
import { RefreshSessionDto } from '../../users/dto/refresh-session-response.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/forgot-password.dto';
import { IsAuthorizedUser } from '../guards/auth.guard';
import { UserAuthService } from '../services/userauth.service';

@Controller('auth1')
export class AuthController1 {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userLogoutService: UserLogoutService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Logs in a user' })
  @ApiOkResponse({
    description: 'User login successful',
  })
  @ApiBadRequestResponse({ description: 'user login failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async login(@Body() loginDto: LoginDto) {
    console.log('Login DTO:', loginDto);

    return await this.userAuthService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ description: 'Ends a user"s session' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logout successful, invalid credentials' })
  @ApiUnauthorizedResponse({ description: 'User mot logged out' })
  @ApiBadRequestResponse({ description: 'No refreshToken ' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  async logoutUser(@Body() dto: logoutUserDto) {
    return this.userLogoutService.logoutUser(dto.refreshToken);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh a session' })
  @ApiOkResponse({
    description: 'User session refreshed',
  })
  @ApiBadRequestResponse({ description: 'user login failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async refreshSession(@Body() refreshSessionDto: RefreshSessionDto) {
    // Ensure refreshToken is defined in RefreshSessionDto and accessed correctly
    const { refreshToken } = refreshSessionDto;
    return await this.userAuthService.refreshSession(refreshToken);
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
