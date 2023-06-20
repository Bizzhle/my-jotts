import { UUID } from 'crypto';
import { Food } from '../../food/entities/food.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_account' })
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  user_id: string;

  @Column()
  email_address: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  enabled: boolean;

  @Column()
  registration_date: Date;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user_account)
  restaurants: Restaurant[];

  @OneToMany(() => Recipe, (recipe) => recipe.user_account)
  recipes: Recipe[];

  @OneToMany(() => Food, (food) => food.user_account)
  foods: Food[];
}
