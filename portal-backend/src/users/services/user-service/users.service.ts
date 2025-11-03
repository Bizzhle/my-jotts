import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/User.entity';
import { UserAccountRepository, UserCondition } from '../../repositories/user-account.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  public async getUserByEmail(emailAddress): Promise<User | null> {
    return await this.userAccountRepository.findUserByEmail(emailAddress);
  }

  public async getUserById(userId: number) {
    return await this.userAccountRepository.findUserById(userId);
  }

  private async getUserDetails(userCondition: UserCondition): Promise<User> {
    const userAccount = await this.userAccountRepository.getUserDetail(userCondition);

    if (!userAccount) {
      throw new NotFoundException('User not found');
    }
    return userAccount;
  }
}
