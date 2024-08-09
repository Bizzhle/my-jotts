import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAccount } from '../../users/entities/user-account.entity';
import { UserRegistrationService } from '../services/user-registration.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersRegistrationController {
  constructor(private readonly userRegistrationService: UserRegistrationService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User account registered' })
  @ApiBadRequestResponse({ description: 'Cannot register user' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async registerUserAccount(@Body() dto: CreateUserDto): Promise<UserAccount> {
    return await this.userRegistrationService.registerUserAccount(dto);
  }
}
