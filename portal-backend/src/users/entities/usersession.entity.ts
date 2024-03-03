import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'user_session' })
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', nullable: true })
  user_id?: number;

  @Column({ type: 'timestamp', nullable: true })
  session_start?: Date;

  @Column({ type: 'timestamp', nullable: true })
  session_end?: Date;

  @Column({ type: 'uuid', nullable: true, unique: true })
  access_token?: string | null;

  @Column({ type: 'uuid', nullable: true, unique: true })
  refresh_token?: string | null;

  @Column({ type: 'timestamp', nullable: true, unique: true })
  refresh_token_expiration_time?: Date;

  // This is to be replaced every refresh
  @Column({ type: 'uuid', nullable: true, unique: true })
  session_id?: string;

  @Column({ type: 'text', nullable: true, unique: true })
  hashed_at?: string;

  @ManyToOne(() => UserAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userAccount: UserAccount;
}
