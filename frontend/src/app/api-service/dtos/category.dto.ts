export interface CategoryInfo {
  id: number;
  categoryName: string;
  description?: string;
}

export interface CategoryRequestData extends Omit<CategoryInfo, "id"> {}

export interface SubCategoryData {
  categoryName: string;
}
