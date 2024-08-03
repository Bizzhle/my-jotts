import { Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostLoginResponseDTO } from '../dto/post-login-response.dto';
import { HasAccess } from '../guards/local.auth.guard';
import { UserLoginService } from '../services/user-service/user-login.service';
import { RequestWithUser } from '../../auth/request-with-user.interface';

@ApiTags('Users')
@Controller('users')
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) {}

  @HasAccess()
  @Post('login')
  @ApiOperation({ summary: 'Logs in a user' })
  @ApiOkResponse({
    description: 'User login successful',
  })
  @ApiBadRequestResponse({ description: 'user login failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @HttpCode(HttpStatus.OK)
  async handleLogin(@Request() req: RequestWithUser): Promise<PostLoginResponseDTO> {
    return await this.userLoginService.login(req.user);
  }
}
