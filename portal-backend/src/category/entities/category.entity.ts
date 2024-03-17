import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { UserAccount } from '../../users/entities/user-account.entity';

@Entity({ name: 'category' })
@Unique(['title'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  @Exclude()
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserAccount, (user) => user.categories)
  @JoinColumn({ name: 'user_id' })
  userAccount: UserAccount;

  @OneToMany(() => Activity, (activity) => activity.category)
  activities: Activity[];
}
