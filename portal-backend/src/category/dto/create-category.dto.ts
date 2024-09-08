import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CategoryResponseDto {
  id: number;
  categoryName: string;
  description?: string;
}
