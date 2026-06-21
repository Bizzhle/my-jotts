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
import { User } from '../../users/entities/User.entity';

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

  @ApiProperty({ description: 'ID of the category', example: 1 })
  @Column({ type: 'integer', name: 'category_id' })
  @Expose({ name: 'categoryId' })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.activities)
  @JoinColumn({ name: 'category_id' })
  @Exclude()
  category: Category;

  @ApiProperty({ description: 'Name of the category', example: 'Electronics' })
  @Expose({ name: 'categoryName' })
  @Transform(({ obj }) => obj.category?.category_name || null)
  get categoryName(): string | null {
    return this.category?.category_name || null;
  }

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

  @ApiProperty({ description: 'Date of activity creation', example: '2023-01-19 13:09:51' })
  @Column({ type: 'date', nullable: true })
  @Expose({ name: 'dateCreated' })
  date_created: Date;

  @ApiProperty({ description: 'Date of activity update', example: '2023-01-19 13:09:51' })
  @Column({ type: 'date', nullable: true })
  @Expose({ name: 'dateUpdated' })
  date_updated: Date;

  @ApiProperty({ description: 'ID of the sub-category', example: 1 })
  @Column({ type: 'integer', nullable: true, name: 'sub_category_id' })
  @Expose({ name: 'subCategoryId' })
  subCategoryId: number;

  @ManyToOne(() => Category, (category) => category.activities)
  @JoinColumn({ name: 'sub_category_id' })
  @Exclude()
  subCategory: Category;

  @ApiProperty({ description: 'Name of the sub-category', example: 'Headphones' })
  @Expose({ name: 'subCategoryName' })
  @Transform(({ obj }) => obj.subCategory?.category_name || null)
  get subCategoryName(): string | null {
    return this.subCategory?.category_name || null;
  }

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ImageFile, (imageFile) => imageFile.activity)
  imageFiles: ImageFile[];
}
