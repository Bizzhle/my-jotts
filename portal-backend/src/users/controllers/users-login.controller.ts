import { Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostLoginResponseDTO } from '../dto/post-login-response.dto';
import { HasAccess } from '../guards/local.auth.guard';
import { UserLoginService } from '../services/user-service/user-login.service';

@ApiTags('Users')
@Controller('users')
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) {}

  @HasAccess()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handleLogin(@Request() req): Promise<PostLoginResponseDTO> {
    return await this.userLoginService.login(req.user);
  }
}
