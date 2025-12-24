import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { addHoursToDate, getTimestampInSeconds } from '../../../app/helpers/date';
import { UserSession } from '../../../users/entities/usersession.entity';
import { UserSessionRepository } from '../../../users/repositories/user-session.repository';
import { JwtPayload, JwtSigningService } from '../../../utils/services/jwt-signing.services';
import { UserAccount } from '../../entities/user-account.entity';
import { calSessionExpirationTime } from './session-expiration-time-utils';

export interface Token {
  accessToken: string;
}

@Injectable()
export class UserSessionService {
  public readonly refreshTokenValidity: 168;
  public readonly sessionExpirationOffset: -12;
  constructor(
    private readonly userSessionRepository: UserSessionRepository,
    private readonly jwtSigningService: JwtSigningService,
  ) {}

  public async createSession(
    userId: number,
    sessionEnd: Date,
    accessToken: string,
    refreshToken: string,
  ): Promise<UserSession> {
    return await this.userSessionRepository.createSession({
      userId,
      sessionEnd,
      accessToken,
      refreshToken,
      refreshTokenExpirationTime: calSessionExpirationTime({
        refreshTokenValidity: 168,
        sessionExpirationOffset: -12,
      }),
    });
  }

  public async generateToken(user: UserAccount, sessionId: string) {
    const jti = randomUUID();
    const refreshToken = randomUUID();
    const sessionEnd = addHoursToDate(1);

    const payload: JwtPayload = {
      sub: user.email_address,
      jti: jti,
      sid: sessionId,
      iat: getTimestampInSeconds(),
      uid: user.id,
      given_name: user.first_name,
      family_name: user.last_name,
    };

    const accessToken = await this.jwtSigningService.signJwt(payload);

    await this.createSession(user.id, sessionEnd, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  public async invalidateUserSession(refreshToken: string): Promise<void> {
    const session = await this.userSessionRepository.findOne({
      where: { refresh_token: refreshToken },
    });

    if (session) {
      session.session_end = new Date();
      session.access_token = null;
      session.refresh_token = null;
      await this.userSessionRepository.save(session);
    }
  }

  public async getValidSessionByRefreshToken(refreshToken) {
    return await this.userSessionRepository.getSessionByRefreshToken(refreshToken);
  }

  private async getValidSessionByCondition(condition: {
    access_token?: string;
    refresh_token?: string;
  }): Promise<UserSession | null> {
    return await this.userSessionRepository.getValidSession(condition);
  }
}
