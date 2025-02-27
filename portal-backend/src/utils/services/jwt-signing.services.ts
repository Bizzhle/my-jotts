import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigningSecretService } from '../../certificates/services/signing-secret.service';

export interface JwtPayload {
  iss?: string;
  sub: string;
  exp?: number;
  iat: number;
  jti: string;
  sid: string;
  uid: number;
  given_name: string;
  family_name: string;
}

@Injectable()
export class JwtSigningService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly signingSecretService: SigningSecretService,
  ) {}

  public async signJwt(payload: JwtPayload) {
    const secret = await this.signingSecretService.getValidSecretKey();
    return this.jwtService.sign(payload, { secret: secret.key, expiresIn: '1h' });
  }

  public async verifyJwt(payload: string): Promise<JwtPayload> {
    const secret = await this.signingSecretService.getValidSecretKey();
    return await this.jwtService.verify(payload, { secret: secret.key });
  }
}
