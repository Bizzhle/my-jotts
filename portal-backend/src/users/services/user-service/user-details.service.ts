import { Injectable } from '@nestjs/common';
import { UserAccount } from '../../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class UserDetailService {
  constructor(private readonly usersService: UsersService) {}

  public async getUserProfileByEmail(emailAddress: string): Promise<UserAccount> {
    return await this.usersService.getUserByEmail(emailAddress);
  }
}
