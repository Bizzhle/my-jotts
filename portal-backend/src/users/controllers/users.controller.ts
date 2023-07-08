import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { logoutUserDto } from '../dto/logout-user.dto';
import { UserLogoutService } from '../services/user-service/user-logout.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userLogoutService: UserLogoutService) {}

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logoutUser(@Body() dto: logoutUserDto) {
    return this.userLogoutService.logoutUser(dto.refreshToken);
  }
}
