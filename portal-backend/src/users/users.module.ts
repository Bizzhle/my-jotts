import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Category } from '../category/entities/category.entity';
import { CertificateModule } from '../certificates/certificate.module';
import { SigningSecret } from '../certificates/entities/signing-secret.entity';
import { SigningSecretService } from '../certificates/services/signing-secret.service';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../permissions/entities/role.entity';
import { UtilsModule } from '../utils/util.module';
import { UserDetailController } from './controllers/user-detail.controller';
import { UsersController } from './controllers/users.controller';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { UserAccount } from './entities/user-account.entity';
import { UserSession } from './entities/usersession.entity';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { UserAccountRepository } from './repositories/user-account.repository';
import { UserSessionRepository } from './repositories/user-session.repository';
import { UserDetailService } from './services/user-service/user-details.service';
import { UserLogoutService } from './services/user-service/user-logout.service';
import { UsersService } from './services/user-service/users.service';
import { UserSessionService } from './services/user-session/user-session.service';

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
      PasswordResetToken,
    ]),
    PassportModule,
    UtilsModule,
    CertificateModule,
  ],
  controllers: [UsersController, UserDetailController],
  providers: [
    UsersService,
    UserAccountRepository,
    UserSessionService,
    UserSessionRepository,
    UserLogoutService,
    UserDetailService,
    JwtAuthGuard,
    SigningSecretService,
  ],
  exports: [UsersService, JwtAuthGuard, UserAccountRepository, UserSessionService],
})
export class UsersModule {}
