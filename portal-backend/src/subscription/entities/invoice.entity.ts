import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceStatus } from '../enum/invoice.enum';
import { UserAccount } from '../../users/entities/user-account.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripeInvoiceId: string; // Stripe invoice ID

  @Column('decimal', { precision: 10, scale: 2 })
  amountDue: number; // Amount due in USD or another currency

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number; // Amount paid

  @Column()
  currency: string; // e.g., "USD"

  @Column({ type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus; // e.g., "paid", "unpaid", "past_due"

  @Column()
  billingReason: string; // e.g., "subscription_create", "subscription_cycle"

  @Column({ nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToOne(() => Subscription, (subscription) => subscription.invoices, { eager: true })
  subscription: Subscription;

  @ManyToOne(() => UserAccount, (user) => user.invoices)
  user: UserAccount;
}
