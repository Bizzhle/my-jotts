import { User } from 'src/users/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceStatus } from '../enum/invoice.enum';

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

  @ManyToOne(() => User, (user) => user.invoices)
  user: User;
}
