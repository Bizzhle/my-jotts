export interface ImageUrl {
  signedUrl: string;
  rawUrl: string;
}

export interface ActivityResponseDto {
  id: number;
  activityTitle: string;
  categoryName: string;
  parentCategoryName?: string;
  categoryId: number;
  parentCategoryId?: number;
  price: number;
  location: string;
  rating: number;
  description: string;
  dateCreated: Date;
  dateUpdated: Date;
  imageUrls: ImageUrl[];
}
