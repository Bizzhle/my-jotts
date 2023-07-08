import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLoginService } from '../services/user-service/user-login.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { PostLoginResponseDTO } from '../dto/post-login-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handleLogin(@Request() req): Promise<PostLoginResponseDTO> {
    return await this.userLoginService.login(req.user);
  }
}
