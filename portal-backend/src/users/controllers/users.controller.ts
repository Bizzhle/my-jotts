import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { logoutUserDto } from '../dto/logout-user.dto';
import { UserLogoutService } from '../services/user-service/user-logout.service';
import { HasAccess } from '../guards/local.auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userLogoutService: UserLogoutService) {}

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
}
