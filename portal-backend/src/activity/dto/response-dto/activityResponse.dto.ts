import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty({ description: 'id of the activity' })
  id: number;

  @ApiProperty({ description: 'Title of the activity' })
  activityTitle: string;

  @ApiProperty({ description: 'name of category activity is assigned to' })
  categoryName: string;

  @ApiProperty({ description: 'id of activity category' })
  categoryId?: number;

  @ApiProperty({ description: 'Price of activity or item' })
  price: number | null;

  @ApiProperty({ description: 'Title of the activity' })
  location: string | null;

  @ApiProperty({ description: 'Rating' })
  rating: number | null;

  @ApiProperty({ description: 'Text that describes activity' })
  description: string | null;

  @ApiProperty({ description: 'Date activity was created' })
  dateCreated: Date;

  @ApiProperty({ description: 'Last update of activity' })
  dateUpdated: Date;

  @ApiProperty({
    description: 'Array of image objects with signed and raw URLs',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        signedUrl: { type: 'string' },
        rawUrl: { type: 'string' },
      },
    },
    required: false,
  })
  imageUrls: { signedUrl: string; rawUrl: string }[];
}
