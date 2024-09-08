import apiClient from "../../libs/Configs/axiosConfig";
import { CategoryData } from "../../webapp/components/Category/CategoryForm";

export async function createCategory(dto: CategoryData) {
  return await apiClient.post(`/category`, dto);
}
