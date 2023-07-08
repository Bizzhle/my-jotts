import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  RemoveOptions,
  Repository,
} from 'typeorm';
import { UserSession } from '../entities/usersession.entity';
import { userSessionDataDto } from '../dto/user-session-data.dto';
import { createDateFromUnixTime } from '../../app/helpers/date';

interface SessionRefresh {
  accessToken: string;
  refreshToken: string;
  tokenExpirationTime: number;
  refreshTokenvalidity: Date;
  sessionRefreshID: string;
}

@Injectable()
export class UserSessionRepository extends Repository<UserSession> {
  constructor(ds: DataSource) {
    super(UserSession, ds.manager);
  }

  public async createSession(dto: userSessionDataDto): Promise<UserSession> {
    const userSession = this.create({ ...dto });
    return await this.save(<UserSession>userSession);
  }

  public async refreshSession(
    session: UserSession,
    sessionRefresh: SessionRefresh,
  ): Promise<UserSession> {
    session.access_token = sessionRefresh.accessToken;
    session.refresh_token = sessionRefresh.refreshToken;
    session.refresh_token_expiration_time = sessionRefresh.refreshTokenvalidity;
    session.session_end = createDateFromUnixTime(sessionRefresh.tokenExpirationTime);
    session.session_id = sessionRefresh.sessionRefreshID;

    return await this.save(session);
  }

  public async getSessionInSetup(sessionId: string): Promise<UserSession> {
    return await this.findOne({
      where: {
        id: sessionId,
        session_start: IsNull(),
        session_end: MoreThanOrEqual(new Date()),
      },
    });
  }

  public async getValidSession(condition: {
    access_token?: string;
    refreshToken?: string;
  }): Promise<UserSession | null> {
    return await this.findOne({
      where: {
        ...condition,
        session_start: LessThanOrEqual(new Date()),
        session_end: MoreThanOrEqual(new Date()),
      },
      relations: ['userAccount'],
    });
  }

  public async getSessionByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return await this.findOne({
      where: {
        refresh_token: refreshToken,
      },
      relations: ['userAccount'],
    });
  }
}
