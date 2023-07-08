import { Body, Controller, Post } from '@nestjs/common';
import { UserRegistrationService } from '../services/user-service/user-registration.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ApiBadGatewayResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAccount } from '../entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersRegistrationController {
  constructor(private readonly userRegistrationService: UserRegistrationService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User account registered' })
  @ApiBadGatewayResponse({ description: 'Cannot register user' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async registerUserAccount(@Body() dto: CreateUserDto): Promise<UserAccount> {
    return await this.userRegistrationService.registerUserAccount(dto);
  }
}
