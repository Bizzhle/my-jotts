import { DataSource, Repository } from 'typeorm';
import { UserAccount } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {
  constructor(ds: DataSource) {
    super(UserAccount, ds.manager);
  }
  public async createUserAccount(dto: CreateUserDto): Promise<UserAccount> {
    const userAccount = this.create({
      first_name: dto.firstName,
      last_name: dto.lastName,
      email_address: dto.emailAddress,
      enabled: true,
      registration_date: new Date(),
    });

    await this.save<UserAccount>(userAccount);

    return userAccount;
  }
}
