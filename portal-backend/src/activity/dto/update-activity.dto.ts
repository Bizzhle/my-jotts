import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateActivityDto } from './create-activity.dto';

export class UpdateActivityDto extends CreateActivityDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // Handle FormData array format (imagesToDelete[])
    if (Array.isArray(value)) {
      return value;
    }
    // If it's a single value, wrap it in an array
    if (typeof value === 'string') {
      return [value];
    }
    return [];
  })
  imagesToDelete?: string[];
}
