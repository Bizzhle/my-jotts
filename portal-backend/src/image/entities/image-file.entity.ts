import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { User } from '../../users/entities/User.entity';
import { ImageProcessingStatus } from '../enum/image-processing-status.enum';

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

  @Column({
    type: 'enum',
    enum: ImageProcessingStatus,
  })
  status: ImageProcessingStatus;

  @ManyToOne(() => Activity, (activity) => activity)
  activity: Activity;

  @ManyToOne(() => User, (user) => user.imageFiles)
  @JoinColumn({ name: 'userId' })
  user: User;
}
