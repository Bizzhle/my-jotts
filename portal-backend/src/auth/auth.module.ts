import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogoutService } from 'src/users/services/user-service/user-logout.service';
import { PasswordResetToken } from '../users/entities/password-reset-token.entity';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/util.module';
import { AuthController } from './controller/auth.controller';
import { UsersRegistrationController } from './controller/users-registration.controller';
import { PasswordService } from './services/password.service';
import { UserRegistrationService } from './services/user-registration.service';
import { UserAuthService } from './services/userauth.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PasswordResetToken]), UtilsModule],
  controllers: [AuthController, UsersRegistrationController],
  providers: [UserAuthService, PasswordService, UserRegistrationService, UserLogoutService],
})
export class AuthModule {}
