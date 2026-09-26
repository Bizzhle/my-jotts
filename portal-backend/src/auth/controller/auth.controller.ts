import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('sign-up')
  // @AllowAnonymous()
  // async signup(@Body() dto: SignUpDto) {
  //   await this.authService.signup(dto);
  //   // return res.status(201).json(result);
  // }

  // @Post('sign-in')
  // @AllowAnonymous()
  // async signin(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
  //   return await this.authService.signin(dto, res);
  // }

  // @Post('sign-out')
  // async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  //   const headers = req.headers;
  //   return await this.authService.signout(headers, res);
  // }

  // @IsAuthorizedUser()
  // @Get('me')
  // async getUser(@GetCurrentUserEmail() email: string) {
  //   return await this.authService.getUserData(email);
  // }

  // @Post('validate-user')
  // @AllowAnonymous()
  // async validateUser(@Body() dto: SignInDto) {
  //   return await this.authService.validateUser(dto.email);
  // }

  // @Post('forgot-password')
  // @AllowAnonymous()
  // async requestPasswordReset(@Body() dto: ForgotPasswordDto) {
  //   return this.authService.requestResetPassword(dto);
  // }

  // @Post('reset-password')
  // @AllowAnonymous()
  // async confirmPasswordReset(@Body() dto: ResetPasswordDto) {
  //   return this.authService.resetPassword(dto);
  // }
}
