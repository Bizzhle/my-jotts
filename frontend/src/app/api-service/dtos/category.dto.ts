export interface CategoryResponseDto {
  id: number;
  categoryName: string;
  description?: string;
  parentCategory?: CategoryResponseDto;
}

export interface CategoryData {
  categoryName: string;
  description?: string;
}

export interface SubCategoryData {
  categoryName: string;
}
