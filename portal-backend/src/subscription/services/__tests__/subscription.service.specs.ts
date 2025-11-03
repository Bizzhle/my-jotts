import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { UserAccountRepository } from '../../../users/repositories/user-account.repository';
import { Subscription } from '../../entities/subscription.entity';
import { SubscriptionService } from '../subscription.service';

const mockUser = {
  id: 1,
  email_address: 'email@email.com',
  first_name: 'email',
  last_name: 'test',
  registration_date: new Date(),
  last_logged_in: new Date(),
};

// const stripeSubscription: Stripe.Subscription = {
//   id: 'sub_123',
//   customer: 'cus_123',
//   status: 'active',
//   current_period_start: 1625097600,
//   current_period_end: 1625097600,
//   latest_invoice: {
//     id: 'inv_123',
//     payment_intent: {
//       id: 'pi_123',
//       client_secret: 'secret_123',
//     },
//   } as Stripe.Invoice,
// } as Stripe.Subscription;

describe('Subscription', () => {
  let service: SubscriptionService;
  let subscriptionRepository;
  let userAccountRepository;
  let stripe: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            getOrCreateCustomer: jest.fn(),
            createSubscription: jest.fn(),
            cancelSubscription: jest.fn(),
            getUserSubscriptionInformation: jest.fn(),
            handleSubscriptionUpdated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    subscriptionRepository = module.get(getRepositoryToken(Subscription));
    userAccountRepository = module.get(UserAccountRepository);
    // stripe = new Stripe('', {
    //   apiVersion: '2024-12-18.acacia',
    // });
    // service['stripe'] = stripe;
  });

  //   it('should create a customer id or return customer id if customer exists', async () => {
  //     const mockUser = { id: 1, email_address: 'test@example.com' };
  //     const newCustomer = { id: 'cus_245', email: mockUser.email_address };
  //     jest.spyOn(stripe.customers, 'create').mockResolvedValue(newCustomer);

  //     const customerId = await service.getOrCreateCustomer(mockUser.id, mockUser.email_address);
  //     expect(customerId).toBe(newCustomer.id);
  //     expect(stripe.customers.create).toHaveBeenCalledWith(mockUser.email_address);
  //   });

  //   it('it should create a subscription', async () => {
  //     const dto: CreateSubscriptionDto = { priceId: 'price_123' };
  //     const emailAddress = 'email@email.com';
  //     const stripeCustomerId = 'cus_123';
  //     userAccountRepository.findOne.mockResolvedValue(mockUser);
  //     jest.spyOn(service, 'getOrCreateCustomer').mockResolvedValue(stripeCustomerId);
  //     jest.spyOn(stripe.subscriptions, 'create').mockResolvedValue(stripeSubscription);
  //     subscriptionRepository.create.mockReturnValue({
  //       stripeSubscriptionId: stripeSubscription.id,
  //       stripeCustomerId: stripeCustomerId,
  //       status: SubscriptionStatus[stripeSubscription.status],
  //       priceId: dto.priceId,
  //       userId: mockUser.id,
  //     });
  //     subscriptionRepository.save.mockResolvedValue({
  //       stripeSubscriptionId: stripeSubscription.id,
  //       stripeCustomerId: stripeCustomerId,
  //       status: SubscriptionStatus[stripeSubscription.status],
  //       priceId: dto.priceId,
  //       userId: mockUser.id,
  //     });

  //     await service.createSubscription(dto, emailAddress);
  //     expect(service.getOrCreateCustomer).toHaveBeenCalledWith(mockUser.id, mockUser.email_address);
  //     expect(subscriptionRepository.create).toHaveBeenCalled();
  //   });
});
