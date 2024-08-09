import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../users/dto/initial-login-response.dto';
import { UsersService } from '../../users/services/user-service/users.service';
import { PasswordService } from './password.service';
import { UserSessionService } from '../../users/services/user-session/user-session.service';
import { randomUUID } from 'crypto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly userSession: UserSessionService,
  ) {}

  async login({ emailAddress, password }: LoginDto) {
    const user = await this.userService.getUserByEmail(emailAddress);
    const sessionId = randomUUID();

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    await this.passwordService.verifyPassword(password, user.password);
    const { accessToken, refreshToken } = await this.userSession.generateToken(user, sessionId);

    return {
      emailAddress: user.email_address,
      accessToken,
      refreshToken,
    };
  }

  async refreshSession(token: string) {
    const session = await this.userSession.getValidSessionbyRefreshToken(token);
    const user = await this.userService.getUserById(session.user_id);
    const sessionId = randomUUID();

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    const { accessToken, refreshToken } = await this.userSession.generateToken(user, sessionId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async changeUserPassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    await this.passwordService.verifyPassword(dto.oldPassword, user.password);

    const newHashedPassword = await this.passwordService.encryptPassword(dto.newPassword);

    await this.userService.updateUserPassword(user, newHashedPassword);
  }

  async forgotPassword(emailAddress: string) {
    const user = await this.userService.getUserByEmail(emailAddress);

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return {
      message: 'If the user exists, they will recieve an email message',
    };
  }
}
