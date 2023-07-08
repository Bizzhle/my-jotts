import { Injectable } from '@nestjs/common';
import { UserSessionService } from '../user-session/user-session.service';

@Injectable()
export class UserLogoutService {
  constructor(private readonly userSessionService: UserSessionService) {}

  async logoutUser(refreshToken: string) {
    try {
      const userSession = await this.userSessionService.getValidSessionbyRefreshToken(refreshToken);

      if (!userSession) {
        throw new Error('Cannot find userSession with valid refresh token');
      }

      await this.userSessionService.logoutSession(refreshToken);
    } catch (err) {
      throw new Error('cannot logout user');
    }
  }
}
