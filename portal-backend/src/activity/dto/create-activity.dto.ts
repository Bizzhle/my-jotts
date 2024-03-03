import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  userId: number;
}
