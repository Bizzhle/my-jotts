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
import { randomUUID } from 'crypto';

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

  // public async getSessionByToken(refreshToken: string) {
  //   5;
  // }

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
