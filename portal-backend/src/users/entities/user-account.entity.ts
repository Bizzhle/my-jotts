import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Category } from '../../category/entities/category.entity';
import { ImageFile } from '../../image/entities/image-file.entity';
import { Role } from '../../permissions/entities/role.entity';
import { Invoice } from '../../subscription/entities/invoice.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';

@Entity({ name: 'user_account' })
@Unique(['email_address'])
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  @Expose({ name: 'emailAddress' })
  email_address: string;

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose({ name: 'firstName' })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose({ name: 'lastName' })
  last_name: string;

  @Column({ type: 'boolean', nullable: true })
  @Expose()
  enabled: boolean;

  @Column({ type: 'timestamp', nullable: false })
  @Expose({ name: 'registrationDate' })
  registration_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  @Expose({ name: 'lastLoggedIn' })
  last_logged_in: Date;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  verification_token: string;

  @ManyToMany(() => Role, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'user_account_role',
    joinColumn: { name: 'user_account_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany(() => Category, (category) => category.userAccount)
  categories: Category[];

  @OneToMany(() => Activity, (activity) => activity.userAccount)
  activities: Activity[];

  @OneToMany(() => ImageFile, (imageFile) => imageFile.userAccount)
  imageFiles: ImageFile[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}
