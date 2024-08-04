import { RegisterData } from "../../registration/RegistrationForm";
import { UserInfo } from "../../webapp/utils/contexts/AuthContext";
import { LoginResponseDto, RefreshResponseDto } from "../dtos/sessionInfo.dto";
import apiClient from "../../libs/Configs/axiosConfig";
import { LogoutUserDto } from "../dtos/logoutUser.dto";
import { SessionState } from "../../libs/SessionState";

export type registrationData = Omit<RegisterData, "confirmPassword">;

export const registerUser = async (
  userData: registrationData
): Promise<void> => {
  try {
    return await apiClient.post(`/users/register`, userData);
  } catch (error) {
    console.error("Error registering user", error);
  }
};

export async function login(
  data: registrationData
): Promise<LoginResponseDto | undefined> {
  const response = await apiClient.post(`/users/login`, data);

  return response.data as LoginResponseDto;
}

export async function logout(data: LogoutUserDto): Promise<void> {
  return await apiClient.post(`/users/logout`, data);
}

export const getUserData = async (): Promise<UserInfo | undefined> => {
  const response = await apiClient.get(`/users/me`);
  return response.data as UserInfo;
};

export async function refreshToken(): Promise<RefreshResponseDto | undefined> {
  const refreshToken = SessionState.refreshToken;

  if (!refreshToken) {
    throw new Error("No Stored tokens found");
  }

  const response = await apiClient.post(`/users/refresh`, { refreshToken });

  console.log("got here");

  return response.data;
}
