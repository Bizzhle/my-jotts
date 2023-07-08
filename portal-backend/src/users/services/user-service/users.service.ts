import { Injectable, NotFoundException } from '@nestjs/common';
import { WithTransactionService } from 'src/app/services/with-transaction.services';
import { UserAccount } from '../../entities/user.entity';
import { UserAccountRepository, UserCondition } from '../../repositories/user-account.repository';

@Injectable()
export class UsersService extends WithTransactionService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {
    super();
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
