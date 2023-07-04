import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAccountRepository } from 'src/users/repositories/user-account.repository';
import { PasswordService } from 'src/users/services/user-password/password.service';
import { Token, UserSessionService } from '../user-session/user-session.service';
import { randomUUID } from 'crypto';
import { InitialLoginResponseDTO } from 'src/users/dto/initial-login-response.dto';
import {
  addHoursToDate,
  createDateFromUnixTime,
  getTimestampInSeconds,
} from '../../../app/helpers/date';
import { PostLoginResponseDTO } from '../../../users/dto/post-login-response.dto';
import { RefreshSessionResponseDto } from '../../dto/refresh-session-response.dto';
import { UserSession } from '../../entities/usersession.entity';
import { UserSessionRepository } from '../../repositories/user-session.repository';
import { calSessionExpirationTime } from '../user-session/session-expiration-time-utils';

export interface JwtPayload {
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
  sid?: string;
}
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly userSessionRepository: UserSessionRepository,
    private readonly passwordService: PasswordService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async validateUser(emailAddress: string, pass: string): Promise<InitialLoginResponseDTO> {
    const user = await this.userAccountRepository.findUserByEmail(emailAddress);
    const decryptedPassword = await this.passwordService.comparePassword(pass, user.password);
    const userSessionId = randomUUID();

    if (!user || !decryptedPassword) {
      throw new ForbiddenException('Wrong user details');
    }

    await this.userSessionService.createSession(userSessionId);

    if (user && decryptedPassword) {
      const { id, user_id, email_address } = user;

      let initialLoginResponse: InitialLoginResponseDTO = {
        id,
        userSessionId,
        userId: user_id,
        emailAddress: email_address,
      };
      return initialLoginResponse;
    }

    return null;
  }

  async login(user: InitialLoginResponseDTO): Promise<PostLoginResponseDTO> {
    let activeSession = null;

    const jti = randomUUID();

    const sessionEnd = createDateFromUnixTime(24);
    const sessionInSetup = await this.userSessionService.getSessionInSetup(user.userSessionId);

    const payload: JwtPayload = {
      sub: user.emailAddress,
      jti: jti,
      sid: sessionInSetup.id,
      iat: getTimestampInSeconds(),
    };

    const hashedAccessToken = await this.jwtService.sign(payload);

    activeSession = await this.userSessionService.activateSession(
      sessionInSetup,
      user.id,
      sessionEnd,
      hashedAccessToken,
    );

    return {
      emailAddress: user.emailAddress,
      accessToken: hashedAccessToken,
      refreshToken: activeSession.refresh_token,
    };
  }

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

  async refreshToken(refreshToken: string): Promise<RefreshSessionResponseDto> {
    let session: UserSession | null = null;

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
    };

    const refreshedHashedAccessToken = await this.jwtService.sign(payload);

    return {
      accesToken: newAccessToken,
      hashedAccessToken: refreshedHashedAccessToken,
      refreshToken: newUserRefreshToken,
    };
  }
}
