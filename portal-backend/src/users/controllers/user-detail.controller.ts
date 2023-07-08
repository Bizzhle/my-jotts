import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserFromJwt } from '../../app/jwt.decorators';
import { UserAccount } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserDetailService } from '../services/user-service/user-details.service';

@ApiTags('Users')
@Controller('users')
export class UserDetailContoller {
  constructor(private readonly userDetailService: UserDetailService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@GetCurrentUserFromJwt() emailAddress: string): Promise<UserAccount> {
    return await this.userDetailService.getUserProfileByEmail(emailAddress);
  }
}
