import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  activityTitle: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number) // Convert the received string to a number
  rating: number;

  @IsString()
  @IsOptional()
  description?: string;
}
