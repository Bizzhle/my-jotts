import { Injectable } from '@nestjs/common';
import { RefreshSessionResponseDto } from '../../dto/refresh-session-response.dto';
import { UserSession } from '../../entities/usersession.entity';
import { UserSessionRepository } from '../../repositories/user-session.repository';
import { calSessionExpirationTime } from './session-expiration-time-utils';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt-signing.services';
import { getTimestampInSeconds } from '../../../app/helpers/date';
import { randomUUID } from 'crypto';

@Injectable()
export class UserSessionRefreshService {
  constructor(
    private jwtService: JwtService,
    private readonly userSessionRepository: UserSessionRepository,
  ) {}

  async refreshToken(refreshToken: string): Promise<RefreshSessionResponseDto> {
    let session: UserSession | null = null;
    try {
      session = await this.userSessionRepository.getSessionByRefreshToken(refreshToken);

      if (!session) throw new Error('Cannot refresh session because session is invalid');

      const refreshTokenvalidityDate = calSessionExpirationTime({
        refreshTokenValidity: 168,
        sessionExpirationOffset: -12,
      });

      const decodedToken = (await this.jwtService.decode(session.hashed_at)) as JwtPayload;

      const accessTokenJti = decodedToken.jti;
      const sessionExpiry = decodedToken.exp;
      const newAccessToken = randomUUID();
      const newUserRefreshToken = randomUUID();
      const newSessionId = randomUUID();

      const refreshedSession = await this.userSessionRepository.refreshSession(session, {
        accessToken: accessTokenJti,
        refreshToken: newUserRefreshToken,
        tokenExpirationTime: sessionExpiry,
        refreshTokenvalidity: refreshTokenvalidityDate,
        sessionRefreshID: newSessionId,
      });

      const payload: JwtPayload = {
        sub: decodedToken.sub,
        jti: newSessionId,
        sid: refreshedSession.id,
        iat: getTimestampInSeconds(),
        given_name: decodedToken.given_name,
        family_name: decodedToken.family_name,
      };

      const refreshedHashedAccessToken = await this.jwtService.sign(payload);

      return {
        accesToken: newAccessToken,
        hashedAccessToken: refreshedHashedAccessToken,
        refreshToken: newUserRefreshToken,
      };
    } catch (err) {
      throw new Error('cannot refresh session');
    }
  }
}
