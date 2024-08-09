import { Request } from 'express';
import { InitialLoginResponseDTO } from '../users/dto/initial-login-response.dto';
import { UserAccount } from '../users/entities/user-account.entity';
import { JwtPayload } from '../users/services/user-service/jwt-signing.services';

export interface RequestWithUser extends Request {
  user: InitialLoginResponseDTO;
  userAccount: UserAccount;
  tokenPayload: JwtPayload;
}
