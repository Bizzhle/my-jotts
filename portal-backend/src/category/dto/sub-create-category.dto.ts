import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  parentCategoryId: number;

  @IsNotEmpty()
  @IsString()
  subCategoryName?: string;
}
