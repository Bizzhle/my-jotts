export interface ImageUrl {
  signedUrl: string | null;
  rawUrl: string | null;
  status: ImageProcessingStatus;
}

export type ImageProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface ActivityResponseDto {
  id: number;
  activityTitle: string;
  categoryName: string;
  subCategoryName?: string;
  categoryId: number;
  subCategoryId?: number;
  price: number;
  location: string;
  rating: number;
  description: string;
  dateCreated: Date;
  dateUpdated: Date;
  imageUrls: ImageUrl[];
}
