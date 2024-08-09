export class PostLoginResponseDTO {
  emailAddress: string;
  accessToken: string;
  refreshToken: string;
}

export class PostLoginDTO {
  refreshToken: string;
}
