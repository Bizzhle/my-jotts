import apiClient from "../../libs/Configs/axiosConfig";
import { ActivityData } from "../../webapp/components/Activity/ActivityDialogForm";
import { ActivityResponseDto } from "../dtos/activity.dto";

export async function createActivity(
  dto: ActivityData,
  files?: File[]
): Promise<void> {
  const formData = new FormData();

  for (const [key, value] of Object.entries(dto)) {
    // Check if the key is 'price' or 'rating' and ensure it is a number
    if (key === "price" || key === "rating") {
      formData.append(key, Number(value).toString());
    } else {
      formData.append(key, value as string);
    }
  }

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("file", file);
    });
  }

  return await apiClient.post(`/activity`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct content type is set
    },
  });
}

export async function getActivity(id: string): Promise<ActivityResponseDto> {
  const activity = await apiClient.get(`/activity/${id}`);
  return activity.data;
}

export async function getActivities(): Promise<ActivityResponseDto[]> {
  const activities = await apiClient.get(`/activity/activities`);
  return activities.data;
}

export async function getActivitiesByCategoryName(
  categoryName: string
): Promise<ActivityResponseDto[]> {
  const activities = await apiClient.get(`/activity/${categoryName}/activity`);
  return activities.data;
}

export async function updateActivity(
  activityId: number,
  dto: ActivityData,
  files?: File[]
): Promise<void> {
  const formData = new FormData();

  for (const [key, value] of Object.entries(dto)) {
    formData.append(key, value as string);
  }

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append(`files`, file);
    });
  }

  return await apiClient.patch(`/activity/${activityId}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct content type is set
    },
  });
}

export async function getCategories(): Promise<[]> {
  const categories = await apiClient.get(`/category/categories`);
  return categories.data;
}
