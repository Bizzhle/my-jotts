import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'priceid of subscription', example: 'price_id' })
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @ApiProperty({ description: 'payment plan id', example: 1 })
  @IsOptional()
  paymentPlanId?: number;
}
