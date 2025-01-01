import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PaymentPlanEnum } from '../enum/payment-plan.enum';

@Entity()
export class PaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PaymentPlanEnum })
  name: PaymentPlanEnum;

  @Column({ nullable: true })
  description: string;

  @Column()
  stripePriceId: string;

  @Column({ nullable: true })
  stripeProductId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

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
