export interface CategoryInfo {
  id: number;
  categoryName: string;
  description?: string;
  parentCategory?: CategoryInfo;
}

export interface CategoryRequestData extends Omit<CategoryInfo, "id"> {}

export interface SubCategoryData {
  categoryName: string;
}
