import apiClient from "../../libs/Configs/axiosConfig";
import { CategoryData } from "../dtos/category.dto";

export async function createCategory(dto: CategoryData) {
  return await apiClient.post(`/category`, dto);
}
