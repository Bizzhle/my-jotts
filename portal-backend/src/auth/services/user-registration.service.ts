import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { WithTransactionService } from 'src/app/services/with-transaction.services';
import { MailerService } from 'src/utils/services/mailer.services';
import { DataSource } from 'typeorm';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { VerifyRegistrationDto } from '../dtos/verify-registration.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserRegistrationService extends WithTransactionService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly datasource: DataSource,
    private readonly passwordService: PasswordService,
    private readonly mailerService: MailerService,
  ) {
    super();
  }
  public async registerUserAccount(dto: CreateUserDto) {
    const transaction = await this.createTransaction(this.datasource);
    const verificationToken = randomUUID();

    try {
      const hashedPassword = await this.passwordService.encryptPassword(dto.password);

      await this.userAccountRepository.createUserAccount(
        dto.emailAddress,
        hashedPassword,
        verificationToken,
      );

      await transaction.commitTransaction();
      return await this.mailerService.sendRegistrationEmail(dto.emailAddress, verificationToken);
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new BadRequestException('Cannot register user', error.message);
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  public async verifyUserAccount(dto: VerifyRegistrationDto) {
    try {
      const user = await this.userAccountRepository.findUserByEmail(dto.emailAddress);

      if (!user) {
        throw new BadRequestException('Invalid email address');
      }

      if (user.verification_token !== dto.verificationToken) {
        throw new BadRequestException('Invalid verification token');
      }

      user.enabled = true;
      user.verification_token = null; // Clear the token after verification
      await this.userAccountRepository.save(user);

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while verifying the user account');
    }
  }

  public async resendVerificationEmail(emailAddress: string) {
    const user = await this.userAccountRepository.findUserByEmail(emailAddress);

    if (!user) {
      throw new BadRequestException('Invalid email address');
    }

    if (user.enabled) {
      throw new BadRequestException('User account is already verified');
    }

    const verificationToken = randomUUID();
    user.verification_token = verificationToken;
    await this.userAccountRepository.save(user);

    return await this.mailerService.sendRegistrationEmail(emailAddress, verificationToken);
  }
}
