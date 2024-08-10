import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from '../activity/repositories/activity.repository';
import { LogsModule } from '../logger/logs.module';
import { UploadModule } from '../upload/upload.module';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { UsersService } from '../users/services/user-service/users.service';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';
import { JwtSigningService } from '../utils/services/jwt-signing.services';
import { UtilsModule } from '../utils/util.module';
import { CertificateModule } from '../certificates/certificate.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), LogsModule, UtilsModule, CertificateModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    ActivityRepository,
    UsersService,
    UserAccountRepository,
    JwtSigningService,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
