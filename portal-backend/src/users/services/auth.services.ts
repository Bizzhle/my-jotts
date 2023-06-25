import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAccountRepository } from 'src/users/repositories/user-account.repository';
import { PasswordService } from 'src/users/services/password.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(emailAddress: string, pass: string): Promise<unknown> {
    const user = await this.userAccountRepository.findUserByEmail(emailAddress);
    const decryptedPassword = await this.passwordService.comparePassword(pass, user.password);

    if (user && decryptedPassword) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    console.log(user);

    const payload = { username: user.email_address, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
