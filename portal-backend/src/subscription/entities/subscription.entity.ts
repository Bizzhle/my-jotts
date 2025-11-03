import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionStatus } from '../enum/subscrition.enum';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  plan: string;

  @Column({ type: 'uuid', unique: true, nullable: false })
  referenceId: string;

  @Column()
  stripeSubscriptionId: string;

  @Column()
  stripeCustomerId: string;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp', nullable: true })
  periodStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  periodEnd: Date;

  @Column({ type: 'boolean', default: false })
  cancelAtPeriodEnd: boolean;

  @Column({ type: 'int', nullable: true })
  seats: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  trialStart: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  trialEnd: Date;
}
