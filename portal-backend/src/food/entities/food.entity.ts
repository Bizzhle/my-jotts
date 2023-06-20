import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { UserAccount } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'food' })
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  food: string;

  @Column('varchar', { array: true, nullable: true })
  ingredients: string[];

  @Column({ nullable: true })
  rating: string;

  @Column({ nullable: true })
  comments: string;

  @Column()
  dateCreated: Date;

  @ManyToOne(() => UserAccount, (user) => user.foods)
  @JoinColumn({ name: 'userId' })
  userAccount: UserAccount;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.foods)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
}
