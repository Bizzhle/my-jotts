import { Controller } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UserLogoutService } from '../services/user-service/user-logout.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userLogoutService: UserLogoutService) {}

  // @Post('logout')
  // @ApiOperation({ description: 'Ends a user"s session' })
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ description: 'User logout successful, invalid credentials' })
  // @ApiUnauthorizedResponse({ description: 'User mot logged out' })
  // @ApiBadRequestResponse({ description: 'No refreshToken ' })
  // @ApiInternalServerErrorResponse({ description: 'Server error' })
  // async logoutUser(@Body() dto: logoutUserDto) {
  //   return this.userLogoutService.logoutUser(dto.refreshToken);
  // }
}
