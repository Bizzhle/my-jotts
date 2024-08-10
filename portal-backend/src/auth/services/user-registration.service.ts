import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WithTransactionService } from 'src/app/services/with-transaction.services';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { PasswordService } from './password.service';

@Injectable()
export class UserRegistrationService extends WithTransactionService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly datasource: DataSource,
    private readonly passwordService: PasswordService,
  ) {
    super();
  }
  public async registerUserAccount(dto: CreateUserDto) {
    const transaction = await this.createTransaction(this.datasource);

    try {
      const hashedpassword = await this.passwordService.encryptPassword(dto.password);

      const userAccount = await this.userAccountRepository.createUserAccount(
        dto.emailAddress,
        hashedpassword,
      );

      await transaction.commitTransaction();
      return userAccount;
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new BadRequestException('Cannot register user');
    } finally {
      await this.closeTransaction(transaction);
    }
  }
}
