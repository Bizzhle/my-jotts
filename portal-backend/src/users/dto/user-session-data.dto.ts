export class userSessionDataDto {
  userId: number;
  sessionEnd: Date;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime: Date;
}
