import { Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserSessionRefreshService } from '../services/user-session/user-session-refresh.service';

@ApiTags('Users')
@Controller('users')
export class UserRefreshController {
  constructor(private readonly userSessionRefreshService: UserSessionRefreshService) {}

  @Post('refresh')
  async refreshTokens(@Request() req) {
    return this.userSessionRefreshService.refreshToken(req.body.refreshToken);
  }
}
