import { ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InitialLoginResponseDTO } from 'src/users/dto/initial-login-response.dto';
import { UserAccountRepository } from 'src/users/repositories/user-account.repository';
import { PasswordService } from 'src/users/services/user-password/password.service';
import { UserSessionService } from '../user-session/user-session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly passwordService: PasswordService,
    private readonly userSessionService: UserSessionService,
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
}
