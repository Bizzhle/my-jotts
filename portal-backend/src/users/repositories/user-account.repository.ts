import { DataSource, Repository } from 'typeorm';
import { UserAccount } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {
  constructor(ds: DataSource) {
    super(UserAccount, ds.manager);
  }
  public async createUserAccount(dto: CreateUserDto, password: string): Promise<UserAccount> {
    const userAccount = this.create({
      first_name: dto.firstName,
      last_name: dto.lastName,
      email_address: dto.emailAddress,
      enabled: true,
      registration_date: new Date(),
      password: password,
    });

    await this.save<UserAccount>(userAccount);

    return userAccount;
  }

  public async findUserByEmail(email_address: string): Promise<UserAccount | null> {
    return await this.createQueryBuilder('user_account')
      .where('LOWER(user_account.email_address) = LOWER(:email_address)', {
        email_address: email_address,
      })
      .getOne();
  }
}
