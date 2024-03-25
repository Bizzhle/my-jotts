import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsOptional()
  description?: string;
}
