import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'pasword-reset-token' })
export class PaswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @Column({ type: 'text', nullable: false, unique: true })
  token: string;

  @Column({ name: 'session_start', type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ name: 'expiry_date', type: 'timestamp', nullable: false })
  expiryDate: Date;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;
}
