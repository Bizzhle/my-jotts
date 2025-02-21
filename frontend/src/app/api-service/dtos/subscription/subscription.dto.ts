import { PaymentPlanDto } from "./payment-plan.dto";

export interface SubscriptionDto {
  id: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  userId: number;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  priceId: string;
  paymentPlan: Partial<PaymentPlanDto>;
}

export interface CreateSubscriptionDto {
  paymentMethod: string | undefined;
  name: string;
  email: string;
  priceId: string;
}

export interface SubscriptionResponseDto {
  subscriptionId: string;
  clientSecret: string;
}
