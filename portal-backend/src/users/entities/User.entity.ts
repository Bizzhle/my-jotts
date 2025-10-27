import { Activity } from 'src/activity/entities/activity.entity';
import { Category } from 'src/category/entities/category.entity';
import { ImageFile } from 'src/image/entities/image-file.entity';
import { Invoice } from 'src/subscription/entities/invoice.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'name', nullable: false })
  name: string;

  @Column('text', { name: 'email', nullable: false, unique: true })
  email: string;

  @Column('boolean', { name: 'emailVerified', nullable: false })
  emailVerified: boolean;

  @Column('text', { name: 'image', nullable: true })
  image: string;

  @Column('date', { name: 'createdAt', nullable: false })
  createdAt: Date;

  @Column('date', { name: 'updatedAt', nullable: false })
  updatedAt: Date;

  @Column('text', { nullable: true })
  stripeCustomerId: string;

  @Column('text', { name: 'role', nullable: false, default: 'user' })
  role: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => ImageFile, (imageFile) => imageFile.user)
  imageFiles: ImageFile[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}
