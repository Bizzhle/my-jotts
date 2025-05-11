import { ForgotPasswordData } from "../../authentication/ForgotPassword";
import { ResetPasswordData } from "../../authentication/ResetPassword";
import apiClient from "../../libs/Configs/axiosConfig";
import { SessionState } from "../../libs/SessionState";
import { UserInfo } from "../../webapp/utils/contexts/AuthContext";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { ForgotPasswordResponseDto } from "../dtos/forgotpassword.dto";
import { LogoutUserDto } from "../dtos/logout-user.dto";
import { registrationData } from "../dtos/registration.dto";
import { LoginResponseDto, RefreshResponseDto } from "../dtos/session-info.dto";

export const registerUser = async (
  userData: registrationData
): Promise<void> => {
  return await apiClient.post(`/auth/register`, userData);
};

export async function login(
  data: registrationData
): Promise<LoginResponseDto | undefined> {
  const response = await apiClient.post(`/auth/login`, data);

  return response.data as LoginResponseDto;
}

export async function logout(data: LogoutUserDto): Promise<void> {
  return await apiClient.post(`/users/logout`, data);
}

export const forgotPassword = async (
  data: ForgotPasswordData
): Promise<ForgotPasswordResponseDto> => {
  const response = await apiClient.post(`/auth/forgot-password`, data);
  return response.data as ForgotPasswordResponseDto;
};

export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  return await apiClient.put(`/auth/reset-password`, data);
};

export const changePassword = async (
  data: ChangePasswordDto
): Promise<void> => {
  return await apiClient.put(`/auth/change-password`, data);
};

export const verifyRegistration = async (
  emailAddress: string,
  verificationToken: string
) => {
  const response = await apiClient.post(`/auth/verify-registration`, {
    emailAddress,
    verificationToken,
  });

  return response;
};

export const getUserData = async (): Promise<UserInfo | undefined> => {
  const response = await apiClient.get(`/users/me`);
  return response.data as UserInfo;
};

export async function refreshToken(): Promise<RefreshResponseDto | undefined> {
  const refreshToken = SessionState.refreshToken;

  if (!refreshToken) {
    throw new Error("No Stored tokens found");
  }

  const response = await apiClient.post(`/auth/refresh`, { refreshToken });

  return response.data;
}
