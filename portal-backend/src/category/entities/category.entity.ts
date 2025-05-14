import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
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
@Unique(['category_name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  @Exclude()
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  @Expose({ name: 'categoryName' })
  category_name: string;

  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Date of category creation', example: '2023-01-19 13:09:51' })
  @Column({ type: 'date', nullable: true })
  createdAt: Date;

  @ApiProperty({ description: 'Date of category update', example: '2023-01-19 13:09:51' })
  @Column({ type: 'date', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => UserAccount, (user) => user.categories)
  @JoinColumn({ name: 'user_id' })
  userAccount: UserAccount;

  @OneToMany(() => Activity, (activity) => activity.category)
  activities: Activity[];
}
