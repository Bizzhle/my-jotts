import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserAccount } from './entities/user-account.entity';
import { UserAccountRepository } from './repositories/user-account.repository';
import { PasswordService } from './services/user-password/password.service';
import { UsersService } from './services/user-service/users.service';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/auth/jwt.config';
import { UserRefreshController } from './controllers/refresh.controller';
import { UserDetailContoller } from './controllers/user-detail.controller';
import { UserLoginController } from './controllers/users-login.controller';
import { UsersRegistrationController } from './controllers/users-registration.controller';
import { UserSession } from './entities/usersession.entity';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { UserSessionRepository } from './repositories/user-session.repository';
import { JwtSigningService } from './services/jwt-signing.services';
import { AuthService } from './services/user-auth/auth.services';
import { UserDetailService } from './services/user-service/user-details.service';
import { UserLoginService } from './services/user-service/user-login.service';
import { UserLogoutService } from './services/user-service/user-logout.service';
import { UserRegistrationService } from './services/user-service/user-registration.service';
import { UserSessionRefreshService } from './services/user-session/user-session-refresh.service';
import { UserSessionService } from './services/user-session/user-session.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Activity } from '../activity/entities/activity.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, UserSession, Activity, Category]),
    PassportModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [
    UsersController,
    UsersRegistrationController,
    UserRefreshController,
    UserLoginController,
    UserDetailContoller,
  ],
  providers: [
    UsersService,
    AuthService,
    UserAccountRepository,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
    UserSessionService,
    UserSessionRepository,
    UserLoginService,
    JwtSigningService,
    UserRegistrationService,
    UserLogoutService,
    UserSessionRefreshService,
    UserDetailService,
    JwtAuthGuard,
  ],
  exports: [
    UsersService,
    PasswordService,
    UserRegistrationService,
    JwtAuthGuard,
    UserAccountRepository,
    UserSessionService,
  ],
})
export class UsersModule {}
