import { Injectable } from '@nestjs/common';
import { InitialLoginResponseDTO } from '../../dto/initial-login-response.dto';
import { PostLoginResponseDTO } from '../../dto/post-login-response.dto';
import { randomUUID } from 'crypto';
import { addHoursToDate, getTimestampInSeconds } from '../../../app/helpers/date';
import { UserSessionService } from '../user-session/user-session.service';
import { JwtPayload, JwtSigningService } from '../jwt-signing.services';

@Injectable()
export class UserLoginService {
  constructor(
    private readonly jwtSigningService: JwtSigningService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async login(user: InitialLoginResponseDTO): Promise<PostLoginResponseDTO> {
    let activeSession = null;

    const jti = randomUUID();

    const sessionEnd = addHoursToDate(1);
    const sessionInSetup = await this.userSessionService.getSessionInSetup(user.userSessionId);

    const payload: JwtPayload = {
      sub: user.emailAddress,
      jti: jti,
      sid: sessionInSetup.id,
      iat: getTimestampInSeconds(),
      given_name: user.firstName,
      family_name: user.lastName,
    };

    const hashedAccessToken = await this.jwtSigningService.signJwt(payload);

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
}
