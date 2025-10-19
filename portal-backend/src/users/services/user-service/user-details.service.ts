import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/User.entity';
import { UsersService } from './users.service';

@Injectable()
export class UserDetailService {
  constructor(private readonly usersService: UsersService) {}

  public async getUserProfileByEmail(emailAddress: string): Promise<User> {
    return await this.usersService.getUserByEmail(emailAddress);
  }
}
