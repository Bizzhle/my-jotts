export interface LoginResponseDto {
  emailAddress: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignInResponseDto {
  email: string;
  token: string;
}
export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}
