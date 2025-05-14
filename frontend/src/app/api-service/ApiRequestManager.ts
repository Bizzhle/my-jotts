import axios, { AxiosError } from "axios";
import { ForgotPasswordData } from "../authentication/ForgotPassword";
import { ResetPasswordData } from "../authentication/ResetPassword";
import { SessionState } from "../libs/SessionState";
import { ActivityData } from "../webapp/components/Activity/ActivityDialogForm";
import { UserInfo } from "../webapp/utils/contexts/AuthContext";
import { ApiMethods } from "./ApiMethods";
import { ActivityResponseDto } from "./dtos/activity.dto";
import { CategoryData, CategoryDto } from "./dtos/category.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { ForgotPasswordResponseDto } from "./dtos/forgotpassword.dto";
import { LogoutUserDto } from "./dtos/logout-user.dto";
import { registrationData } from "./dtos/registration.dto";
import { LoginResponseDto, RefreshResponseDto } from "./dtos/session-info.dto";
import { PaymentPlanDto } from "./dtos/subscription/payment-plan.dto";
import {
  SubscriptionDto,
  SubscriptionResponseDto,
} from "./dtos/subscription/subscription.dto";
import { ENDPOINTS } from "./EndPoints";

interface ApiError {
  status: number;
  message?: string;
  error?: string;
}

export class ApiHandler {
  static login = (
    params: registrationData
  ): Promise<LoginResponseDto | undefined> => {
    const url = ENDPOINTS.LOGIN();
    return ApiMethods.post(url, params);
  };
  static registerUser = (params: registrationData) => {
    const url = ENDPOINTS.REGISTER_USER();
    return ApiMethods.post(url, params);
  };
  static logout = (params: LogoutUserDto): Promise<void> => {
    const url = ENDPOINTS.LOGOUT();
    return ApiMethods.post<void, LogoutUserDto>(url, params);
  };
  static forgotPassword = (
    params: ForgotPasswordData
  ): Promise<ForgotPasswordResponseDto> => {
    const url = ENDPOINTS.FORGOT_PASSWORD();
    return ApiMethods.post<ForgotPasswordResponseDto, ForgotPasswordData>(
      url,
      params
    );
  };
  static resetPassword = (params: ResetPasswordData): Promise<void> => {
    const url = ENDPOINTS.RESET_PASSWORD();
    return ApiMethods.put<void, ResetPasswordData>(url, params);
  };
  static changePassword = (params: ChangePasswordDto): Promise<void> => {
    const url = ENDPOINTS.CHANGE_PASSWORD();
    return ApiMethods.put<void, ChangePasswordDto>(url, params);
  };
  static verifyRegistration = (
    emailAddress: string,
    verificationToken: string
  ): Promise<{ message: string }> => {
    const url = ENDPOINTS.VERIFY_REGISTRATION();
    return ApiMethods.post(url, { emailAddress, verificationToken });
  };
  static getUserData = (): Promise<UserInfo> => {
    const url = ENDPOINTS.GET_USER_DATA();
    return ApiMethods.get<UserInfo>(url);
  };
  static refreshToken = (): Promise<RefreshResponseDto> => {
    const refreshToken = SessionState.refreshToken;

    if (!refreshToken) {
      throw new Error("No Stored tokens found");
    }

    const url = ENDPOINTS.REFRESH_TOKEN();
    return ApiMethods.post<LoginResponseDto>(url, {
      refreshToken,
    });
  };
  static createActivity = (
    dto: ActivityData,
    files?: File[]
  ): Promise<void> => {
    const formData = createActivityFormData(dto, files);
    const url = ENDPOINTS.CREATE_ACTIVITY();
    return ApiMethods.postFormData(url, formData);
  };
  static getActivity = (id: string): Promise<ActivityResponseDto> => {
    const url = ENDPOINTS.GET_ACTIVITY(id);
    return ApiMethods.get<ActivityResponseDto>(url);
  };
  static getActivities = (search?: string): Promise<ActivityResponseDto[]> => {
    const url = ENDPOINTS.GET_ACTIVITIES(search);
    return ApiMethods.get<ActivityResponseDto[]>(url);
  };
  static getActivitiesByCategoryName = (
    categoryName: string
  ): Promise<ActivityResponseDto[]> => {
    const url = ENDPOINTS.GET_ACTIVITIES_BY_CATEGORY_NAME(categoryName);
    return ApiMethods.get<ActivityResponseDto[]>(url);
  };
  static updateActivity = (
    activityId: number,
    dto: ActivityData,
    files?: File[]
  ): Promise<void> => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(dto)) {
      formData.append(key, value as string);
    }

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append(`files`, file);
      });
    }
    const url = ENDPOINTS.UPDATE_ACTIVITY(activityId);

    return ApiMethods.patchFormData(url, formData);
  };
  static deleteActivity = (activityId: number): Promise<void> => {
    const url = ENDPOINTS.DELETE_ACTIVITY(activityId);
    return ApiMethods.delete(url);
  };
  static getCategories = (): Promise<CategoryDto[]> => {
    const url = ENDPOINTS.GET_CATEGORIES();
    return ApiMethods.get(url);
  };
  static createCategory = (params: CategoryData): Promise<void> => {
    const url = ENDPOINTS.CREATE_CATEGORY();
    return ApiMethods.post(url, params);
  };
  static deleteCategory = (categoryId: number): Promise<void> => {
    const url = ENDPOINTS.DELETE_CATEGORY(categoryId);
    return ApiMethods.delete(url);
  };
  static updateCategory = (
    categoryId: number,
    params: CategoryData
  ): Promise<void> => {
    const url = ENDPOINTS.UPDATE_CATEGORY(categoryId);
    return ApiMethods.patch(url, params);
  };
  static createSubscription = (
    priceId: string,
    paymentPlanId: number
  ): Promise<SubscriptionResponseDto> => {
    const url = ENDPOINTS.CREATE_SUBSCRIPTION();
    return ApiMethods.post(url, { priceId, paymentPlanId });
  };
  static getSubscription = (): Promise<SubscriptionDto> => {
    const url = ENDPOINTS.GET_SUBSCRIPTION();
    return ApiMethods.get(url);
  };
  static cancelSubscription = (subscriptionId: string): Promise<void> => {
    const url = ENDPOINTS.CANCEL_SUBSCRIPTION(subscriptionId);
    return ApiMethods.delete(url);
  };
  static getPaymentPlans = (): Promise<PaymentPlanDto[]> => {
    const url = ENDPOINTS.GET_PAYMENT_PLANS();
    return ApiMethods.get(url);
  };
}

export function createActivityFormData(
  dto: ActivityData,
  files?: File[]
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(dto)) {
    const val =
      key === "price" || key === "rating" ? Number(value).toString() : value;

    formData.append(key, val as string);
  }

  if (files?.length) {
    files.forEach((file) => {
      formData.append("file", file);
    });
  }

  return formData;
}

export function isApiError(error: unknown): string | undefined {
  let errorMessage;
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response?.data) {
      const apiError = axiosError.response.data;
      return apiError.message || apiError.error;
    }
  }
  return errorMessage;
}
