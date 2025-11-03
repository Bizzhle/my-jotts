export interface SubscriptionDto {
  limits: Record<string, number> | undefined;
  priceId: string | undefined;
  id: string;
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStart?: Date;
  trialEnd?: Date;
  referenceId: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid";
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  groupId?: string;
  seats?: number;
  // id: number;
  // stripeSubscriptionId: string;
  // stripeCustomerId: string;
  // userId: number;
  // status: string;
  // currentPeriodStart: Date;
  // currentPeriodEnd: Date;
  // priceId: string;
  // paymentPlan: Partial<PaymentPlanDto>;
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
