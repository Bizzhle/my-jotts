import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { UserAccount } from '../entities/user-account.entity';
import { IsAuthenticatedUser } from '../guards/jwt.auth.guard';
import { UserDetailService } from '../services/user-service/user-details.service';

@ApiTags('Users')
@Controller('users')
export class UserDetailContoller {
  constructor(private readonly userDetailService: UserDetailService) {}

  @IsAuthenticatedUser()
  @Get('me')
  async getUser(@GetCurrentUserFromJwt() emailAddress: string): Promise<UserAccount> {
    return await this.userDetailService.getUserProfileByEmail(emailAddress);
  }
}
