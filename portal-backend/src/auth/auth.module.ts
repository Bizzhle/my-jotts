import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/User.entity';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/util.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User]), UtilsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthenticationModule {}
