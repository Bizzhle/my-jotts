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
import { SubscriptionModule } from '../subscription/subscription.module';
import { Subscription } from '../subscription/entities/subscription.entity';
import { SubscriptionService } from '../subscription/services/subscription.service';
import { InvoiceService } from '../subscription/services/invoice.service';
import { PaymentPlanService } from '../subscription/services/payment-plan.service';
import { PaymentPlan } from '../subscription/entities/payment-plan.entity';
import { Invoice } from '../subscription/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    LogsModule,
    UtilsModule,
    CertificateModule,
    SubscriptionModule,
  ],
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
