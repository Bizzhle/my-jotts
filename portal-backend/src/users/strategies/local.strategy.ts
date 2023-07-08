import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/user-auth/auth.services';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'emailAddress',
      passwordField: 'password',
    });
  }

  async validate(emailAddress: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(emailAddress, password);
    if (!user) {
      throw new UnauthorizedException('here');
    }
    return user;
  }
}
