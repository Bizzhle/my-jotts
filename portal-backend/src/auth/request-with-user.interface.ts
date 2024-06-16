import { Request } from 'express';
import { UserRole } from '../permissions/enums/roles.enum';
import { InitialLoginResponseDTO } from '../users/dto/initial-login-response.dto';
import { UserAccount } from '../users/entities/user-account.entity';

export interface RequestWithUser extends Request {
  user: InitialLoginResponseDTO;
  userAccount: UserAccount;
}
