import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Restaurant',
  })
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'A place to eat and drink',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The name of the subcategory',
    example: 'Fast Food',
  })
  @IsOptional()
  @IsString()
  subCategoryName?: string;
}
