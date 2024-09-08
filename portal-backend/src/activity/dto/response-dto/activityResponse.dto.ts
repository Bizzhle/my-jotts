import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty({ description: 'id of the activity' })
  id: number;

  @ApiProperty({ description: 'Title of the activity' })
  activityTitle: string;

  @ApiProperty({ description: 'name of category activity is assigned to' })
  categoryName: string;

  @ApiProperty({ description: 'Price of activity or item' })
  price?: number;

  @ApiProperty({ description: 'Title of the activity' })
  location?: string;

  @ApiProperty({ description: 'Rating' })
  rating?: number;

  @ApiProperty({ description: 'Text that describes activity' })
  description?: string;

  @ApiProperty({ description: 'Date activity was created' })
  dateCreated?: Date;

  @ApiProperty({ description: 'Last update of activity' })
  dateUpdated?: Date;

  @ApiProperty({ description: 'image of activity ' })
  imageUrls?: string[];
}
