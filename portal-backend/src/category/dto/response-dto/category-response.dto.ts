export class CategoryResponseDto {
  id: number;
  categoryName: string;
  description?: string;
  parentCategories?: CategoryResponseDto;
}
