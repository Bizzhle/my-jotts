import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  iss?: string;
  sub: string;
  exp?: number;
  iat: number;
  jti: string;
  sid: string;
  given_name: string;
  family_name: string;
}

@Injectable()
export class JwtSigningService {
  constructor(private readonly jwtService: JwtService) {}

  public signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
