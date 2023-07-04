import { Token } from '../services/user-session/user-session.service';

export class PostLoginResponseDTO {
  emailAddress: string;
  accessToken: string;
  refreshToken: string;
}
