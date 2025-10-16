import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserAccount } from '../../users/entities/user-account.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { VerifyRegistrationDto } from '../dtos/verify-registration.dto';
import { UserRegistrationService } from '../services/user-registration.service';

@Controller('auth1')
export class UsersRegistrationController {
  constructor(private readonly userRegistrationService: UserRegistrationService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User account registered' })
  @ApiBadRequestResponse({ description: 'Cannot register user' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async registerUserAccount(@Body() dto: CreateUserDto): Promise<UserAccount> {
    return await this.userRegistrationService.registerUserAccount(dto);
  }

  @Post('verify-registration')
  @ApiCreatedResponse({ description: 'User account verified' })
  @ApiBadRequestResponse({ description: 'Cannot verify user account' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async verifyUserAccount(@Body() dto: VerifyRegistrationDto): Promise<{ message: string }> {
    return await this.userRegistrationService.verifyUserAccount(dto);
  }

  @Post('resend-verification')
  @ApiCreatedResponse({ description: 'Verification email resent' })
  @ApiBadRequestResponse({ description: 'Cannot resend verification email' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async resendVerificationEmail(@Body('email') email: string): Promise<{ message: string }> {
    return await this.userRegistrationService.resendVerificationEmail(email);
  }
}
