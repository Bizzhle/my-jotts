export const ENDPOINTS = {
  // Auth
  LOGIN: (): string => "/auth/login",
  LOGOUT: (): string => "/users/logout",
  REGISTER_USER: (): string => {
    return `/auth/register`;
  },
  FORGOT_PASSWORD: (): string => "/auth/forgot-password",
  RESET_PASSWORD: (): string => "/auth/reset-password",
  CHANGE_PASSWORD: (): string => "/auth/change-password",
  VERIFY_REGISTRATION: (): string => `/auth/verify-registration`,
  GET_USER_DATA: (): string => `/users/me`,
  REFRESH_TOKEN: (): string => `/auth/refresh`,
  CREATE_ACTIVITY: (): string => `/activities`,
  GET_ACTIVITY: (id: string): string => `/activities/${id}`,
  GET_ACTIVITIES: (search?: string): string => {
    const searchParams = search ? new URLSearchParams({ search }) : undefined;
    return `/activities?${searchParams?.toString()}`;
  },
  GET_ACTIVITIES_BY_CATEGORY_NAME: (categoryName: string): string =>
    `/activities/${categoryName}/activity`,
  UPDATE_ACTIVITY: (activityId: number): string =>
    `/activities/${activityId}/update`,
  GET_CATEGORIES: (): string => `/category/categories`,
  CREATE_CATEGORY: (): string => `/category`,
  CREATE_SUBSCRIPTION: (): string => `/subscription`,
  GET_SUBSCRIPTION: (): string => `/subscription`,
  CANCEL_SUBSCRIPTION: (subscriptionId: string): string =>
    `/subscription/${subscriptionId}`,
  GET_PAYMENT_PLANS: (): string => `/payment-plan`,
};
