import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { UserAccount } from '../entities/user-account.entity';
import { UserDetailService } from '../services/user-service/user-details.service';
import { IsAuthorizedUser } from '../../auth/guards/auth.guard';

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
  async getUser(@GetCurrentUserFromJwt() emailAddress: string): Promise<UserAccount> {
    return await this.userDetailService.getUserProfileByEmail(emailAddress);
  }
}
