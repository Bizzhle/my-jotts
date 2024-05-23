import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InitialLoginResponseDTO } from 'src/users/dto/initial-login-response.dto';
import { UserAccountRepository } from 'src/users/repositories/user-account.repository';
import { PasswordService } from 'src/users/services/user-password/password.service';
import { UserSessionService } from '../user-session/user-session.service';
import { JwtService } from '@nestjs/jwt';
import { UserAccount } from '../../entities/user-account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly passwordService: PasswordService,
    private readonly userSessionService: UserSessionService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailAddress: string, pass: string): Promise<InitialLoginResponseDTO> {
    try {
      const user = await this.userAccountRepository.findUserByEmail(emailAddress);
      await this.passwordService.verifyPassword(pass, user.password);
      const userSessionId = randomUUID();

      await this.userSessionService.createSession(userSessionId);

      const { id, email_address, first_name, last_name } = user;

      let initialLoginResponse: InitialLoginResponseDTO = {
        id,
        userSessionId,
        emailAddress: email_address,
        firstName: first_name,
        lastName: last_name,
      };

      return initialLoginResponse;
    } catch (error) {
      throw new ForbiddenException('Wrong credentials provided', error);
    }
  }

  async validateToken(token: string): Promise<UserAccount> {
    try {
      const secret = 'your-secret-key';
      const decoded = await this.jwtService.verify(token, { secret });

      const user = await this.userAccountRepository.findUserByEmail(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error);
    }
  }
}
