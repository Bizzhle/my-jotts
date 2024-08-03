import { Injectable } from '@nestjs/common';
import { generateRandomId } from 'src/app/helpers/id';
import { addHoursToDate } from '../../../app/helpers/date';
import { UserSession } from '../../../users/entities/usersession.entity';
import { UserSessionRepository } from '../../../users/repositories/user-session.repository';
import { calSessionExpirationTime } from './session-expiration-time-utils';

export interface Token {
  accessToken: string;
}

@Injectable()
export class UserSessionService {
  public readonly refreshTokenValidity: 168;
  public readonly sessionExpirationOffset: -12;
  constructor(private readonly userSessionRepository: UserSessionRepository) {}

  public async createSession(userSessionId: string): Promise<UserSession> {
    return await this.userSessionRepository.createSession({
      id: userSessionId,
      session_end: addHoursToDate(1),
      refresh_token_expiration_time: calSessionExpirationTime({
        refreshTokenValidity: 168,
        sessionExpirationOffset: -12,
      }),
    });
  }

  public async activateSession(
    session: UserSession,
    userAccountId: number,
    sessionEnd: Date,
    hashedAccessToken: string,
  ): Promise<any> {
    session.session_start = new Date();
    session.session_end = sessionEnd;
    session.user_id = userAccountId;
    session.access_token = generateRandomId();
    session.refresh_token = generateRandomId();
    session.hashed_at = hashedAccessToken;

    return await this.userSessionRepository.save(session);
  }

  public async logoutSession(refreshToken: string): Promise<void> {
    const session = await this.userSessionRepository.findOne({
      where: { refresh_token: refreshToken },
    });

    if (session) {
      session.session_end = new Date();
      (session.access_token = null),
        (session.refresh_token = null),
        (session.hashed_at = null),
        await this.userSessionRepository.save(session);
    }
  }

  public async getSessionInSetup(sessionId): Promise<UserSession> {
    return await this.userSessionRepository.getSessionInSetup(sessionId);
  }

  public async getValidSessionbyRefreshToken(refreshToken) {
    return await this.getValidSessionByCondition({ refresh_token: refreshToken });
  }

  private async getValidSessionByCondition(condition: {
    access_token?: string;
    refresh_token?: string;
  }): Promise<UserSession | null> {
    return await this.userSessionRepository.getValidSession(condition);
  }
}
