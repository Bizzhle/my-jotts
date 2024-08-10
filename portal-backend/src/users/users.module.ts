import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserAccount } from './entities/user-account.entity';
import { UserAccountRepository } from './repositories/user-account.repository';
import { UsersService } from './services/user-service/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserDetailController } from './controllers/user-detail.controller';
import { UsersRegistrationController } from '../auth/controller/users-registration.controller';
import { UserSession } from './entities/usersession.entity';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { UserSessionRepository } from './repositories/user-session.repository';
import { UserDetailService } from './services/user-service/user-details.service';
import { UserLogoutService } from './services/user-service/user-logout.service';
import { UserSessionService } from './services/user-session/user-session.service';
import { Activity } from '../activity/entities/activity.entity';
import { Category } from '../category/entities/category.entity';
import { Role } from '../permissions/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { SigningSecret } from '../certificates/entities/signing-secret.entity';
import { SigningSecretService } from '../certificates/services/signing-secret.service';
import { JwtSigningService } from './services/user-service/jwt-signing.services';
import { PaswordResetToken } from './entities/password-reset-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAccount,
      UserSession,
      Activity,
      Category,
      Role,
      Permission,
      SigningSecret,
      PaswordResetToken,
    ]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [UsersController, UserDetailController],
  providers: [
    UsersService,
    UserAccountRepository,
    UserSessionService,
    UserSessionRepository,
    JwtSigningService,
    UserLogoutService,
    UserDetailService,
    JwtAuthGuard,
    SigningSecretService,
  ],
  exports: [
    UsersService,
    JwtAuthGuard,
    UserAccountRepository,
    UserSessionService,
    JwtSigningService,
  ],
})
export class UsersModule {}
