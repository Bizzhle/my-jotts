import { Food } from '../../food/entities/food.entity';
import { UserAccount } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'restaurant' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  firstVisit: Date;

  @Column({ nullable: true })
  lastVisit: Date;

  @Column()
  dateCreated: Date;

  @OneToMany(() => Food, (food) => food.restaurant)
  foods: Food;

  @ManyToOne(() => UserAccount, (user) => user.restaurants)
  @JoinColumn({ name: 'userId' })
  userAccount: UserAccount;
}
