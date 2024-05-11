import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Category } from '../../category/entities/category.entity';
import { ImageFile } from '../../image/entities/image-file.entity';

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

  @Column({ type: 'varchar', nullable: false })
  @Expose({ name: 'firstName' })
  first_name: string;

  @Column({ type: 'varchar', nullable: false })
  @Expose({ name: 'lastName' })
  last_name: string;

  @Column({ type: 'boolean', nullable: true })
  @Expose()
  enabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @Expose({ name: 'registrationDate' })
  registration_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Expose({ name: 'lastLoggedIn' })
  last_logged_in: Date;

  @OneToMany(() => Category, (category) => category.userAccount)
  categories: Category[];

  @OneToMany(() => Activity, (activity) => activity.userAccount)
  activities: Activity[];

  @OneToMany(() => ImageFile, (imageFile) => imageFile.userAccount)
  imageFiles: ImageFile[];
}
