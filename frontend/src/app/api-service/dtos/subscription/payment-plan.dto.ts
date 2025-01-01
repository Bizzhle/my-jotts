export interface PaymentPlanDto {
  id: number;
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
  currency: string;
  billingInterval: string;
  intervalCount: number;
  isActive: boolean;
  features: string[];
  link: string;
}
