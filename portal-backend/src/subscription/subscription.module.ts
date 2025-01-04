import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionService } from './services/subscription.service';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { PaymentPlan } from './entities/payment-plan.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './services/invoice.service';
import { PaymentPlanService } from './services/payment-plan.service';
import { PaymentPlanController } from './controller/payment-plan.controller';
import { UtilsModule } from '../utils/util.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Subscription, PaymentPlan, Invoice]),
    UtilsModule,
  ],
  controllers: [SubscriptionController, PaymentPlanController],
  providers: [SubscriptionService, InvoiceService, UserAccountRepository, PaymentPlanService],
  exports: [SubscriptionService, PaymentPlanService, InvoiceService],
})
export class SubscriptionModule {}
