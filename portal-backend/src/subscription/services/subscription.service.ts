import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { auth } from '../../../auth';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { UserAccountRepository } from '../../users/repositories/user-account.repository';
import { PaymentPlan } from '../entities/payment-plan.entity';
import { Subscription } from '../entities/subscription.entity';
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

  // async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
  //   try {
  //     const paymentIntent = await this.stripe.paymentIntents.create({
  //       amount,
  //       currency,
  //       payment_method_types: ['card'],
  //     });
  //     return paymentIntent;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  async getActiveSubscription(headers: HeadersInit) {
    const sub = await this.getUserSubscriptionOfUser(headers);
    const activeSubscription = sub.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing',
    );
    return activeSubscription;
  }

  async getSubscriptionLimits(headers: HeadersInit) {
    const sub = await this.getUserSubscriptionOfUser(headers);
    const activeSubscription = sub.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing',
    );
    return activeSubscription?.limits?.projects || null;
  }

  async getUserSubscriptionOfUser(headers: HeadersInit) {
    const subscriptions = await auth.api.listActiveSubscriptions({
      // This endpoint requires session cookies.
      headers: await headers,
    });

    return subscriptions;
    // get the active subscription

    // Check subscription limits
    // const projectLimit = subscriptions?.limits?.projects || 0;
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
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.invoiceService.handleUpdateInvoice(invoice); // Handle successful payment
        break;
      }
      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice;
        await this.invoiceService.handleUpdateInvoice(failedInvoice);
        break;
      }
      case 'customer.subscription.updated': {
        const updatedSubscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates (renewals, changes)
        await this.handleSubscriptionUpdated(updatedSubscription);
        break;
      }
      // case 'customer.subscription.deleted':
      //   const canceledSubscription = event.data.object as Stripe.Subscription;
      //   await this.cancelSubscription(canceledSubscription.id);
      //   break;
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
