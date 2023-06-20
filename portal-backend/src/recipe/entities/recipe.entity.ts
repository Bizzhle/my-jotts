import { UserAccount } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'recipe' })
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  food: string;

  @Column('varchar', { array: true, nullable: true })
  ingredients: string[];

  @Column('varchar', { array: true, nullable: true })
  steps: string[];

  @Column()
  comments: string;

  @Column()
  date_created: Date;

  @ManyToOne(() => UserAccount, (user) => user.recipes)
  @JoinColumn({ name: 'userId' })
  user_account: UserAccount;
}
