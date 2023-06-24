import { Food } from '../../food/entities/food.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_account' })
@Unique(['email_address'])
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  user_id: string;

  @Column()
  email_address: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  enabled: boolean;

  @Column()
  @Exclude()
  registration_date: Date;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user_account)
  restaurants: Restaurant[];

  @OneToMany(() => Recipe, (recipe) => recipe.user_account)
  recipes: Recipe[];

  @OneToMany(() => Food, (food) => food.user_account)
  foods: Food[];
}
