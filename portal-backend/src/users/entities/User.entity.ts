import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Category } from '../../category/entities/category.entity';
import { ImageFile } from '../../image/entities/image-file.entity';
import { Invoice } from '../../subscription/entities/invoice.entity';

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

  @Column('timestamptz', { name: 'createdAt', nullable: false })
  createdAt: Date;

  @Column('timestamptz', { name: 'updatedAt', nullable: false })
  updatedAt: Date;

  @Column('text', { nullable: true })
  stripeCustomerId: string;

  @Column('text', { name: 'role', nullable: false, default: 'user' })
  role: string;

  @Column('boolean', { name: 'banned', nullable: true, default: false })
  banned: boolean;

  @Column('text', { name: 'banReason', nullable: true })
  banReason: string;

  @Column('timestamptz', { name: 'banExpiresAt', nullable: true })
  banExpires: Date | null;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => ImageFile, (imageFile) => imageFile.user)
  imageFiles: ImageFile[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}
