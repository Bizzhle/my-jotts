import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserEmail } from '../../app/decorators/jwt.decorators';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';
import { User } from '../entities/User.entity';
import { UserDetailService } from '../services/user-service/user-details.service';

@ApiTags('Users')
@Controller('users')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @IsAuthorizedUser()
  @Get('me')
  @ApiOperation({ description: 'return user"s details' })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'invalid credential' })
  @ApiUnauthorizedResponse({ description: 'invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  async getUser(@GetCurrentUserEmail() emailAddress: string): Promise<User> {
    return await this.userDetailService.getUserProfileByEmail(emailAddress);
  }
}
