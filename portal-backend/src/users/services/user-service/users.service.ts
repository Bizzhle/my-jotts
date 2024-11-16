import { Injectable, NotFoundException } from '@nestjs/common';
import { WithTransactionService } from 'src/app/services/with-transaction.services';
import { UserAccount } from '../../entities/user-account.entity';
import { UserAccountRepository, UserCondition } from '../../repositories/user-account.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  public async getUserByEmail(emailAddress): Promise<UserAccount | null> {
    return await this.userAccountRepository.findUserByEmail(emailAddress);
  }

  public async getUserById(userId: number) {
    return await this.userAccountRepository.findUserById(userId);
  }

  public async updateUserPassword(user: UserAccount, hashedPassword: string) {
    user.password = hashedPassword;
    return await this.userAccountRepository.save(user);
  }

  private async getUserDetails(userCondition: UserCondition): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.getUserDetail(userCondition);

    if (!userAccount) {
      throw new NotFoundException('User not found');
    }
    return userAccount;
  }
}
