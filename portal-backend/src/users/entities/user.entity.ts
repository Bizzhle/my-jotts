import { Food } from '../../food/entities/food.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'user_account' })
@Unique(['email_address'])
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  @Expose({ name: 'userId' })
  user_id: string;

  @Column()
  @Expose({ name: 'emailAddress' })
  email_address: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Expose({ name: 'firstName' })
  first_name: string;

  @Column()
  @Expose({ name: 'lastName' })
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
