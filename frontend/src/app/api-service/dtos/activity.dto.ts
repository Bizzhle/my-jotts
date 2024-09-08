export interface ActivityResponseDto {
  id: number;
  activityTitle: string;
  categoryName: string;
  price?: number;
  location?: string;
  rating: number;
  description?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  imageUrls?: string[];
}
