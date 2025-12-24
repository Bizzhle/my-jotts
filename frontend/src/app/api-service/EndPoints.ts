export const ENDPOINTS = {
  // Auth
  LOGIN: (): string => "/auth/sign-in",
  LOGOUT: (): string => "/auth/sign-out",
  REGISTER_USER: (): string => {
    return `/auth/sign-up`;
  },
  FORGOT_PASSWORD: (): string => "/auth/forgot-password",
  RESET_PASSWORD: (): string => "/auth/reset-password",
  CHANGE_PASSWORD: (): string => "/auth/change-password",
  VERIFY_REGISTRATION: (): string => `/auth/verify-registration`,
  GET_USER_DATA: (): string => `/auth/me`,
  REFRESH_TOKEN: (): string => `/auth/refresh`,
  CREATE_ACTIVITY: (): string => `/activities`,
  GET_ACTIVITY: (id: string): string => `/activities/${id}`,
  GET_ACTIVITIES: (
    search?: string,
    limit?: number,
    offset?: number
  ): string => {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.append("search", search);
    }
    if (limit) {
      searchParams?.append("limit", limit.toString());
    }
    if (offset) {
      searchParams?.append("offset", offset.toString());
    }

    return `/activities?${searchParams?.toString()}`;
  },
  GET_ACTIVITIES_BY_CATEGORY_NAME: (categoryName: string): string =>
    `/activities/${categoryName}/activity`,
  GET_ACTIVITIES_BY_CATEGORY_ID: (categoryId: string | number): string =>
    `/activities/${categoryId}/category`,
  UPDATE_ACTIVITY: (activityId: number): string =>
    `/activities/${activityId}/update`,
  DELETE_ACTIVITY: (activityId: number): string =>
    `/activities/${activityId}/delete`,
  GET_CATEGORIES: (): string => `/category/categories`,
  GET_CATEGORY: (categoryId: string | number): string =>
    `/category/${categoryId}`,
  CREATE_CATEGORY: (): string => `/category`,
  DELETE_CATEGORY: (categoryId: number): string =>
    `category/${categoryId}/delete`,
  UPDATE_CATEGORY: (categoryId: number): string =>
    `/category/${categoryId}/update`,
  CREATE_SUBSCRIPTION: (): string => `/subscription`,
  GET_SUBSCRIPTION: (): string => `/subscription`,
  CANCEL_SUBSCRIPTION: (subscriptionId: string): string =>
    `/subscription/${subscriptionId}`,
  GET_PAYMENT_PLANS: (): string => `/payment-plan`,
  SEND_SUPPORT_REQUEST: (): string => `/support/request`,
  GET_SUBCATEGORIES_BY_PARENT_ID: (parentId: number): string =>
    `/category/sub-categories/${parentId}`,
};
