import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/user-auth/auth.services';
import { InitialLoginResponseDTO } from '../dto/initial-login-response.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'emailAddress',
      passwordField: 'password',
    });
  }

  async validate(emailAddress: string, password: string): Promise<InitialLoginResponseDTO> {
    const user = await this.authService.validateUser(emailAddress, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
