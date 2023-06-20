import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserAccountRepository } from '../repositories/user-account.repository';
import { DataSource } from 'typeorm';
import { WithTransactionService } from 'src/app/services/with-transaction.services';

@Injectable()
export class UsersService extends WithTransactionService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly datasource: DataSource,
  ) {
    super();
  }
  public async registerUserAccount(dto: CreateUserDto) {
    const transaction = await this.createTransaction(this.datasource);

    try {
      const userAccount = await this.userAccountRepository.createUserAccount(dto);

      await transaction.commitTransaction();
      return userAccount;
    } catch (error) {
      await transaction.rollbackTransaction();
      throw error;
    } finally {
      await this.closeTransaction(transaction);
    }
  }
}
