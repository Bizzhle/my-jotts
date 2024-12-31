import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PaymentPlanEnum } from '../enum/payment-plan.enum';

@Entity()
export class PaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PaymentPlanEnum })
  name: PaymentPlanEnum; // e.g., "Basic Plan", "Pro Plan"

  @Column({ nullable: true })
  description: string;

  @Column()
  stripePriceId: string; // Stripe price ID for this plan

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Price in USD or another currency

  @Column()
  currency: string; // e.g., "USD"

  @Column()
  billingInterval: 'month' | 'year';

  @Column('simple-array')
  features: string[];

  @Column({ nullable: true })
  link: string;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
