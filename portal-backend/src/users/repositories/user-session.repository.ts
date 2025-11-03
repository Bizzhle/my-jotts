import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataSource, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { userSessionDataDto } from '../dto/user-session-data.dto';
import { UserSession } from '../entities/usersession.entity';

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
    const userSession = this.create({
      id: randomUUID(),
      user_id: dto.userId,
      session_start: new Date(),
      session_end: dto.sessionEnd,
      access_token: dto.accessToken,
      refresh_token: dto.refreshToken,
      refresh_token_expiration_time: dto.refreshTokenExpirationTime,
    });
    await this.save<UserSession>(userSession);

    return userSession;
  }

  public async getSessionByRefreshToken(refreshToken: string) {
    return this.findOne({
      where: {
        refresh_token: refreshToken,
        // Ensure the refresh token is still valid by checking its expiration time.
        refresh_token_expiration_time: MoreThanOrEqual(new Date()),
        session_start: LessThanOrEqual(new Date()),
        session_end: MoreThanOrEqual(new Date()),
      },
    });
  }

  public async getValidSession(condition: {
    access_token?: string;
    refreshToken?: string;
  }): Promise<UserSession | null> {
    return this.findOne({
      where: {
        access_token: condition.access_token,
        refresh_token: condition.refreshToken,
        refresh_token_expiration_time: MoreThanOrEqual(new Date()),
        session_start: LessThanOrEqual(new Date()),
        session_end: MoreThanOrEqual(new Date()),
      },
      relations: ['userAccount'],
    });
  }

  // public async getSessionByRefreshToken(refreshToken: string): Promise<UserSession | null> {
  //   return await this.findOne({
  //     where: {
  //       refresh_token: refreshToken,
  //     },
  //     relations: ['userAccount'],
  //   });
  // }
}
