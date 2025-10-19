import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/User.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { PaymentPlan } from '../entities/payment-plan.entity';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionStatus } from '../enum/subscrition.enum';
import { InvoiceService } from './invoice.service';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;
  private webhookSecret: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly invoiceService: InvoiceService,
    private readonly logService: AppLoggerService,
    @InjectRepository(PaymentPlan)
    private readonly paymentPlanRepository: Repository<PaymentPlan>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  public async getOrCreateCustomer(user: User) {
    const { stripeCustomerId } = await this.subscriptionRepository.findOne({
      where: { user },
    });
    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: 'Paul Egbo',
      });
      return customer.id;
    }
    return stripeCustomerId;
  }

  async createSubscription(dto: CreateSubscriptionDto, emailAddress: string) {
    try {
      const user = await this.userAccountRepository.findOne({
        where: {
          email: emailAddress,
        },
      });

      const paymentPlan = await this.paymentPlanRepository.findOne({
        where: { id: dto.paymentPlanId },
      });
      const stripeCustomerId = await this.getOrCreateCustomer(user);

      const stripeSubscription = await this.createStripeSubscription(stripeCustomerId, dto.priceId);

      const subscriptionData: Partial<Subscription> = {
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeCustomerId,
        status: SubscriptionStatus[stripeSubscription.status],
        priceId: dto.priceId,
        user: user,
        paymentPlan: paymentPlan,
      };

      const subscription = this.subscriptionRepository.create(subscriptionData);
      await this.subscriptionRepository.save(subscription);

      const stripeInvoice = stripeSubscription.latest_invoice as Stripe.Invoice;
      if (stripeInvoice) {
        await this.invoiceService.createInvoice(stripeInvoice);
      }
      const paymentIntent = await this.createPaymentIntent(
        stripeInvoice.amount_due,
        stripeInvoice.currency,
      );
      return {
        subscriptionId: stripeSubscription.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createStripeSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
      });
      return paymentIntent;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (subscription) {
      await this.stripe.subscriptions.cancel(subscriptionId);
      subscription.status = SubscriptionStatus.cancelled;
      await this.subscriptionRepository.save(subscription);
    }
  }

  async getUserSubscriptionInformation(username: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        email: username,
      },
    });
    return await this.subscriptionRepository.findOne({
      where: { user, status: SubscriptionStatus.active },
    });
  }

  async webhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, sig, this.webhookSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await this.invoiceService.handleUpdateInvoice(invoice); // Handle successful payment
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await this.invoiceService.handleUpdateInvoice(failedInvoice);
        break;
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates (renewals, changes)
        await this.handleSubscriptionUpdated(updatedSubscription);
        break;
      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object as Stripe.Subscription;
        await this.cancelSubscription(canceledSubscription.id);
        break;
      default:
        this.logService.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    // if (subscription) {
    //   subscription.status = SubscriptionStatus[stripeSubscription.status];
    //   ((subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000)),
    //     (subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000)));
    //   await this.subscriptionRepository.save(subscription);
    // }
  }
}
