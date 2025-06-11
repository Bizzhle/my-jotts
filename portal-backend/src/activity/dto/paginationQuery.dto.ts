import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export const PAGINATION_ITEMS_PER_PAGE = 50; // Default items per page for pagination

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Limit the number of results returned',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer value' })
  @Max(PAGINATION_ITEMS_PER_PAGE, {
    message: `Limit must not exceed ${PAGINATION_ITEMS_PER_PAGE}`,
  })
  @Type(() => Number)
  limit?: number; // Default limit for pagination

  @ApiProperty({
    description: 'Offset for pagination',
  })
  @IsOptional()
  @IsInt({ message: 'Offset must be an integer value' })
  @Type(() => Number)
  offset?: number; // Default offset for pagination
}
