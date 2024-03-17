import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { UserAccount } from '../../users/entities/user-account.entity';

@Entity({ name: 'activity' })
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'integer' })
  @Expose({ name: 'categoryId' })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.activities)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'integer', nullable: true })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'integer', nullable: true })
  rating: number;

  @Column({ nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'date', nullable: true })
  @Expose({ name: 'dateCreated' })
  date_created: Date;

  @Column({ type: 'date', nullable: true })
  @Expose({ name: 'dateUpdated' })
  date_updated: Date;

  @Column({ type: 'integer' })
  @Exclude()
  user_id: number;

  @ManyToOne(() => UserAccount, (user) => user.activities)
  @JoinColumn({ name: 'user_id' })
  userAccount: UserAccount;
}
