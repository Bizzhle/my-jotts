import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../users/entities/user-account.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity()
export class ImageFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column()
  @Exclude()
  activity_id: number;

  @Column({ type: 'integer' })
  @Exclude()
  user_id: number;

  @ManyToOne(() => Activity, (activity) => activity)
  @JoinColumn({ name: 'activity_id' })
  @Exclude()
  activity: Activity;

  @ManyToOne(() => UserAccount, (user) => user.imageFiles)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  userAccount: UserAccount;
}
