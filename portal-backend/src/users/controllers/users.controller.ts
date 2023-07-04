import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UsersService } from '../services/user-service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAccount } from '../entities/user.entity';
import { AuthService } from '../services/user-auth/auth.services';
import { LocalAuthGuard } from '../../users/guards/local.auth.guard';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { logoutUserDto } from '../dto/logout-user.dto';
import { PostLoginResponseDTO } from '../dto/post-login-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'User account registered' })
  @ApiBadGatewayResponse({ description: 'Cannot register user' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async registerUserAccount(@Body() dto: CreateUserDto): Promise<UserAccount> {
    return await this.usersService.registerUserAccount(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handleLogin(@Request() req): Promise<PostLoginResponseDTO> {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Request() req): Promise<UserAccount> {
    return await this.usersService.getUserByEmail(req.user.emailAddress);
  }

  @Post('refresh')
  async refreshTokens(@Request() req) {
    return this.authService.refreshToken(req.body.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logoutUser(@Body() dto: logoutUserDto) {
    return this.authService.logoutUser(dto.refreshToken);
  }
}
