import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserAuthService } from './services/userauth.service';
import { PasswordService } from './services/password.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaswordResetToken } from '../users/entities/password-reset-token.entity';
import { UtilsModule } from '../utils/util.module';
import { UsersRegistrationController } from './controller/users-registration.controller';
import { UserRegistrationService } from './services/user-registration.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PaswordResetToken]), UtilsModule],
  controllers: [AuthController, UsersRegistrationController],
  providers: [UserAuthService, PasswordService, UserRegistrationService],
})
export class AuthModule {}
