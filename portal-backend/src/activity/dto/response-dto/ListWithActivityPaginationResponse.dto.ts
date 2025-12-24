import { ApiProperty } from '@nestjs/swagger';

export class ListWithActivityPaginationResponseDto<T> {
  @ApiProperty({
    description: 'Start index for pagination',
    example: 1,
  })
  offset: number;

  @ApiProperty({
    description: 'Activities to be returned',
    example: 1,
  })
  limit: number;

  @ApiProperty({
    description: 'No of activities returned',
    example: 1,
  })
  count: number | null;

  data: T;
}
