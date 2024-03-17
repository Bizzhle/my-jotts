import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from '../activity/repositories/activity.repository';
import { LogsModule } from '../logs/module/logs.module';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { UsersService } from '../users/services/user-service/users.service';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), LogsModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    ActivityRepository,
    UsersService,
    UserAccountRepository,
  ],
})
export class CategoryModule {}
