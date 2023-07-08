export class userSessionDataDto {
  id: string;
  user_id?: number;
  session_start?: Date;
  session_end?: Date;
  access_token?: string;
  refresh_token?: string;
  refresh_token_expiration_time?: Date;
  session_id?: string;
}
