import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserAuthService } from './services/userauth.service';
import { PasswordService } from './services/password.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [UserAuthService, PasswordService],
})
export class AuthModule {}
