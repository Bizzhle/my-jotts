import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserAccountRepository, UserCondition } from '../../repositories/user-account.repository';
import { DataSource } from 'typeorm';
import { WithTransactionService } from 'src/app/services/with-transaction.services';
import { PasswordService } from '../user-password/password.service';
import { UserAccount } from '../../entities/user.entity';

@Injectable()
export class UsersService extends WithTransactionService {
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
      const password = await this.passwordService.encryptPassword(dto.password);

      const userAccount = await this.userAccountRepository.createUserAccount(dto, password);

      await transaction.commitTransaction();
      return userAccount;
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new BadGatewayException('Cannot register user');
    } finally {
      await this.closeTransaction(transaction);
    }
  }

  public async getUserByEmail(emailAddress): Promise<UserAccount | null> {
    return await this.getUserDetails(emailAddress);
  }

  private async getUserDetails(userCondition: UserCondition): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.getUserDetail(userCondition);

    if (!userAccount) {
      throw new NotFoundException('User not found');
    }
    return userAccount;
  }
}
