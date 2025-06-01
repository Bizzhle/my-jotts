export interface ActivitiesResponseDto {
  id: number;
  activityTitle: string;
  categoryName: string;
  categoryId: number;
  price?: number;
  location?: string;
  rating: number;
  description?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  imageUrls?: string;
}

export interface ActivityResponseDto {
  id: number;
  activityTitle: string;
  categoryName: string;
  categoryId: number;
  price: number;
  location: string;
  rating: number;
  description: string;
  dateCreated: Date;
  dateUpdated: Date;
  imageUrls: string[];
}
