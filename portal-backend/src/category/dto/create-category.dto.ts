import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
