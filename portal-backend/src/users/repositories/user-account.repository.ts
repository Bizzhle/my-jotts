import { Injectable } from '@nestjs/common';
import { DataSource, FindOperator, Raw, Repository } from 'typeorm';
import { User } from '../entities/User.entity';

export interface UserCondition {
  id?: User['id'];
  email_address?: User['email'];
}
@Injectable()
export class UserAccountRepository extends Repository<User> {
  constructor(ds: DataSource) {
    super(User, ds.manager);
  }
  // public async createUserAccount(
  //   emailAddress: string,
  //   password: string,
  //   token: string,
  // ): Promise<UserAccount> {
  //   const userAccount = this.create({
  //     email_address: emailAddress,
  //     password: password,
  //     enabled: false,
  //     registration_date: new Date(),
  //     last_logged_in: new Date(),
  //     verification_token: token,
  //   });

  //   await this.save<UserAccount>(userAccount);

  //   return userAccount;
  // }

  // public async updateUserAccount(userId: number) {
  //   await this.update(userId, { last_logged_in: new Date() });
  // }

  public async findUserByEmail(email: string): Promise<User | null> {
    return await this.findOneBy({
      email,
    });
  }

  public async findUserRoleById(userId: string): Promise<string | null> {
    const user = await this.findOne({
      where: { id: userId },
      select: ['role'],
    });
    return user ? user.role : null;
  }

  public async findUserById(userId: number): Promise<User | null> {
    return await this.createQueryBuilder('user_account').where({ id: userId }).getOne();
  }

  public async getUserDetail(userCondition: UserCondition): Promise<User | null> {
    return await this.findOne({
      where: UserAccountRepository.filterCondition(userCondition),
    });
  }

  private static filterCondition(
    userCondition: UserCondition,
  ): Record<string, FindOperator<User> | number> {
    const whereQuery: Record<string, FindOperator<User> | number> = {};

    if (userCondition.email_address) {
      whereQuery['email_address'] = Raw<User>((column) => `LOWER(${column}) = :value`, {
        value: userCondition.email_address.toLowerCase(),
      });
    }

    return whereQuery;
  }
}
