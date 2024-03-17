import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserAccountRepository } from 'src/users/repositories/user-account.repository';
import { PasswordService } from 'src/users/services/user-password/password.service';
import { UserSessionService } from '../user-session/user-session.service';
import { randomUUID } from 'crypto';
import { InitialLoginResponseDTO } from 'src/users/dto/initial-login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
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
      const { id, email_address, first_name, last_name } = user;

      let initialLoginResponse: InitialLoginResponseDTO = {
        id,
        userSessionId,
        emailAddress: email_address,
        firstName: first_name,
        lastName: last_name,
      };

      return initialLoginResponse;
    }

    return null;
  }
}
