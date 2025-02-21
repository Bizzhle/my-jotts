import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlanEnum } from '../enum/payment-plan.enum';

export class CreatePaymentPlanDto {
  @ApiProperty({ description: 'Name of payment plan', example: 'Basic' })
  name: PaymentPlanEnum;

  @ApiProperty({ description: 'Stripe price id of payment plan', example: 'Basic' })
  stripePriceId: string;

  @ApiProperty({ description: 'Stripe product id of payment plan', example: 'product_id' })
  stripeProductId: string;

  @ApiProperty({ description: 'Price of payment plan', example: 4.99 })
  price: number;

  @ApiProperty({ description: 'Currency of payment plan', example: 'EUR' })
  currency: string;

  @ApiProperty({
    description: 'Features of payment plan',
    example: ['5 activities', '5 image uploads'],
  })
  features: string[];

  @ApiProperty({ description: 'Interval of subscription', example: 'Monthly' })
  billingInterval: 'month' | 'year';

  @ApiProperty({ description: 'is Payment available for users', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Stripe payment link', example: 'http://stripe.com...' })
  link: string;
}
