import { Module } from '@nestjs/common';
import { UsersService } from './services/user-service/users.service';
import { UsersController } from './controllers/users.controller';
import { UserAccount } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountRepository } from './repositories/user-account.repository';
import { PasswordService } from './services/user-password/password.service';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/auth/jwt.config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/user-auth/auth.services';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), PassportModule, JwtModule.register(jwtConfig)],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    UserAccountRepository,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
