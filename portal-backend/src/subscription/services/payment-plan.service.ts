import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentPlan } from '../entities/payment-plan.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../../envvars';
import { CreatePaymentPlanDto } from '../dtos/payment-plan.dto';
import { PaymentPlanEnum } from '../enum/payment-plan.enum';

@Injectable()
export class PaymentPlanService {
  private stripe: Stripe;
  constructor(
    private configService: ConfigService<EnvVars>,
    @InjectRepository(PaymentPlan)
    private paymentPlanRepository: Repository<PaymentPlan>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async getAllActivePlans() {
    return await this.paymentPlanRepository.find({
      where: { isActive: true },
    });
  }

  async getPlanById(id: number) {
    return await this.paymentPlanRepository.findOne({
      where: { id },
    });
  }
  async findPlanByStripePriceId(priceId: string) {
    return await this.paymentPlanRepository.findOne({ where: { stripePriceId: priceId } });
  }

  async createPlan(planData: CreatePaymentPlanDto): Promise<PaymentPlan> {
    const product = await this.stripe.products.create({ name: planData.name });

    const price = await this.stripe.prices.create({
      unit_amount: planData.price,
      currency: planData.currency,
      recurring: { interval: planData.billingInterval },
      product: product.id,
    });

    const paymentLink = await this.stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://localhost:5173/subscription', // URL to redirect after payment
        },
      },
    });

    const paymentPlan = this.paymentPlanRepository.create({
      name: planData.name,
      stripePriceId: price.id,
      stripeProductId: product.id,
      price: planData.price,
      currency: planData.currency,
      billingInterval: planData.billingInterval,
      isActive: true,
      link: paymentLink.url,
      features: planData.features,
    });
    return this.paymentPlanRepository.save(paymentPlan);
  }

  async updatePlan(id: number, planData: Partial<PaymentPlan>) {
    const plan = await this.paymentPlanRepository.findOne({
      where: { id: id, stripeProductId: planData.stripeProductId },
    });
    if (plan) await this.paymentPlanRepository.update(id, planData);
  }

  async deactivatePlan(id: number) {
    await this.paymentPlanRepository.update(id, { isActive: false });
  }
}
