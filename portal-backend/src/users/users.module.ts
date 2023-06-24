import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserAccount } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountRepository } from './repositories/user-account.repository';
import { PasswordService } from './services/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  controllers: [UsersController],
  providers: [UsersService, UserAccountRepository, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
