import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ImageFile } from '../../image/entities/image-file.entity';
import { UserAccount } from '../../users/entities/user-account.entity';

@Entity({ name: 'activity' })
@Unique(['activity_title'])
export class Activity {
  @ApiProperty({ description: 'ID of the activity', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of activity', example: 'EarBuds' })
  @Column({ type: 'varchar', nullable: false })
  @Expose({ name: 'activityTitle' })
  activity_title: string;

  @ApiProperty({ description: 'Name of activity', example: 'EarBuds' })
  @Column({ type: 'integer' })
  @Transform(({ obj }) => obj.category?.category_name || null)
  @Expose({ name: 'categoryName' })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.activities)
  @JoinColumn({ name: 'category_id' })
  @Exclude()
  category: Category;

  @ApiProperty({ description: 'Price  of item if given', example: 50 })
  @Column({ type: 'integer', nullable: true })
  price: number;

  @ApiProperty({
    description: 'Location of activity, this could be a destination or when item was bought',
    example: '2 Reinheimer strasse Hessen',
  })
  @Column({ type: 'varchar', nullable: true })
  location: string;

  @ApiProperty({ description: 'Rating of activity', example: 'EarBuds' })
  @Column({ type: 'integer', nullable: true })
  rating: number;

  @ApiProperty({
    description: 'Description of activity',
    example: 'EarBuds were good, would buy again',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'String url of Image attached to activity gotten from AWS',
    example: '',
  })
  @Column({ type: 'varchar', nullable: true })
  @Transform(({ obj }) => obj.imageFile?.url)
  @Expose({ name: 'imageUrl' })
  imageFile_url: string;

  @OneToMany(() => ImageFile, (imageFile) => imageFile.activity)
  @JoinColumn({ name: 'imageFile_url' })
  @Exclude()
  imageFiles: ImageFile[];

  @ApiProperty({ description: 'Date of activity creation', example: '2023-01-19 13:09:51' })
  @Column({ type: 'date', nullable: true })
  @Expose({ name: 'dateCreated' })
  date_created: Date;

  @ApiProperty({ description: 'Date of activity update', example: '2023-01-19 13:09:51' })
  @Column({ type: 'date', nullable: true })
  @Expose({ name: 'dateUpdated' })
  date_updated: Date;

  @Column({ name: 'user_id', type: 'integer' })
  @Exclude()
  user_id: number;

  @ManyToOne(() => UserAccount, (user) => user.activities)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  userAccount: UserAccount;
}
