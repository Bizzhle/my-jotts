import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  subCategoryName?: string;
}
