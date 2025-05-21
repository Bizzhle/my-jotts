import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { WithTransactionService } from 'src/app/services/with-transaction.services';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { LoginDto } from '../../users/dto/initial-login-response.dto';
import { PasswordResetToken } from '../../users/entities/password-reset-token.entity';
import { UsersService } from '../../users/services/user-service/users.service';
import { UserSessionService } from '../../users/services/user-session/user-session.service';
import { MailerService } from '../../utils/services/mailer.services';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ResetPasswordDto } from '../dtos/forgot-password.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserAuthService extends WithTransactionService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly userSession: UserSessionService,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly mailerService: MailerService,
    private readonly datasource: DataSource,
  ) {
    super();
  }

  async login({ emailAddress, password }: LoginDto) {
    try {
      const sessionId = randomUUID();
      const user = await this.userService.getUserByEmail(emailAddress);

      if (!user) {
        throw new NotFoundException({
          message: 'Email address does not exist',
        });
      }

      await this.passwordService.verifyPassword(password, user.password);
      const { accessToken, refreshToken } = await this.userSession.generateToken(user, sessionId);

      return {
        emailAddress: user.email_address,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshSession(token: string) {
    const session = await this.userSession.getValidSessionByRefreshToken(token);
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
    try {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new UnauthorizedException('user not found');
      }

      await this.passwordService.verifyPassword(dto.oldPassword, user.password);

      const newHashedPassword = await this.passwordService.encryptPassword(dto.newPassword);

      await this.userService.updateUserPassword(user, newHashedPassword);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not change password, try again');
    }
  }

  async forgotPassword(emailAddress: string) {
    const transaction = await this.createTransaction(this.datasource);
    try {
      const user = await this.userService.getUserByEmail(emailAddress);
      const resetToken = randomUUID();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      if (!user) {
        throw new NotFoundException('Email address not registered');
      }

      const reset = await this.passwordResetTokenRepository.create({
        userId: user.id,
        token: resetToken,
        createdAt: new Date(),
        expiryDate: expiryDate,
      });

      await this.passwordResetTokenRepository.save(reset);

      await this.mailerService.sendPasswordResetEmail(emailAddress, resetToken);
      await transaction.commitTransaction();

      return {
        message: 'Check your email for password reset link',
      };
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new BadRequestException(error, 'Cannot reset password');
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const transaction = await this.createTransaction(this.datasource);

    const confirmToken = await this.passwordResetTokenRepository.findOneByOrFail({
      token: dto.token,
      expiryDate: MoreThan(new Date()),
    });

    const user = await this.userService.getUserById(confirmToken.userId);

    if (!user) {
      throw new UnauthorizedException('EmailAddress does not exist');
    }

    try {
      const hashedPassword = await this.passwordService.encryptPassword(dto.password);
      await this.userService.updateUserPassword(user, hashedPassword);
      await this.mailerService.sendResetPasswordConfirmation(user.email_address);
      await transaction.commitTransaction();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not reset password, try again');
    } finally {
      await this.closeTransaction(transaction);
    }
  }
}
