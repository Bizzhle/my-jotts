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
  userId: string;

  @Column()
  emailAddress: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  enabled: boolean;

  @Column()
  registrationDate: Date;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.userAccount)
  restaurants: Restaurant[];

  @OneToMany(() => Recipe, (recipe) => recipe.userAccount)
  recipes: Recipe[];

  @OneToMany(() => Food, (food) => food.userAccount)
  foods: Food[];
}
