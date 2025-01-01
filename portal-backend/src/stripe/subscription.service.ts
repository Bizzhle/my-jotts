import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EnvVars } from '../envvars';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccountRepository } from '../users/repositories/user-account.repository';
import { Request, Response } from 'express';
import { Subscription } from '../subscription/entities/subscription.entity';
import { SubscriptionStatus } from '../subscription/enum/subscrition.enum';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;
  private webhookSecret: string;
  constructor(
    private configService: ConfigService<EnvVars>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly userAccountRepository: UserAccountRepository,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  public async createOrUpdateSubscription(subscription: Stripe.Subscription, emailAddress: string) {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscription.id },
    });
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: emailAddress,
      },
    });

    const subscriptionData = {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: SubscriptionStatus[subscription.status],
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      priceId: subscription.items.data[0].price.id,
      userId: user.id,
    };

    if (existingSubscription) {
      await this.subscriptionRepository.update(existingSubscription.id, subscriptionData);
    } else {
      const newSubscription = this.subscriptionRepository.create(subscriptionData);
      await this.subscriptionRepository.save(newSubscription);
    }
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.cancelled;
      await this.subscriptionRepository.save(subscription);
    }
  }

  async getUserSubscriptionInformation(username: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        email_address: username,
      },
    });
    return await this.subscriptionRepository.findOne({
      where: { userId: user.id },
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, emailAddress: string) {
    const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription as string);
    await this.createOrUpdateSubscription(subscription, emailAddress);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription as string);
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existingSubscription) {
      existingSubscription.status = SubscriptionStatus.past_due;
      await this.subscriptionRepository.save(existingSubscription);
    }
  }

  async webhook(req: Request, res: Response, emailAddress: string) {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      const stripe = new Stripe(this.webhookSecret, { apiVersion: '2024-12-18.acacia' });
      event = stripe.webhooks.constructEvent(payload, sig, this.webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentSucceeded(invoice, emailAddress);
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentFailed(failedInvoice);
        break;
      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates (renewals, changes)
        await this.createOrUpdateSubscription(subscription, emailAddress);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', updatedSubscription);
        // Handle subscription updates (renewals, changes)
        await this.createOrUpdateSubscription(updatedSubscription, emailAddress);
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionData =
          typeof session.subscription === 'string'
            ? await this.stripe.subscriptions.retrieve(session.subscription)
            : session.subscription;
        await this.createOrUpdateSubscription(subscriptionData, emailAddress);
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object as Stripe.Subscription;
        await this.cancelSubscription(canceledSubscription.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).send('Webhook Received');
  }
}
