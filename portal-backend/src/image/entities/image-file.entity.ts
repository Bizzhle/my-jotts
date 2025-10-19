import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/User.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Activity, (activity) => activity)
  activity: Activity;

  @ManyToOne(() => User, (user) => user.imageFiles)
  @JoinColumn({ name: 'userId' })
  user: User;
}
