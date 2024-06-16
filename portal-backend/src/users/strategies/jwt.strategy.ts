import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../services/jwt-signing.services';
import { SigningSecretService } from '../../certificates/services/signing-secret.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public readonly signingSecretService: SigningSecretService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          const secret = await signingSecretService.getValidSecretKey();
          done(null, secret.key);
        } catch (err) {
          done(err, false);
        }
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
