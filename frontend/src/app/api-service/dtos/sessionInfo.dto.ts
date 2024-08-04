export interface LoginResponseDto {
  emailAddress: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
  hashedAccessToken: string;
}
