import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/User.entity';
import { UserAccountRepository, UserCondition } from '../../repositories/user-account.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  public async getUserByEmail(emailAddress): Promise<User | null> {
    const user = await this.userAccountRepository.findUserByEmail(emailAddress);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  public async getUserById(userId: number) {
    return await this.userAccountRepository.findUserById(userId);
  }

  public async findUserRoleById(userId: string) {
    return await this.userAccountRepository.findUserRoleById(userId);
  }

  private async getUserDetails(userCondition: UserCondition): Promise<User> {
    const userAccount = await this.userAccountRepository.getUserDetail(userCondition);

    if (!userAccount) {
      throw new NotFoundException('User not found');
    }
    return userAccount;
  }
}
