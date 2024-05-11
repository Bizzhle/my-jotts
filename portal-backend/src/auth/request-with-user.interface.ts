import { Request } from 'express';
import { UserAccount } from '../users/entities/user-account.entity';

export interface RequestWithUser extends Request {
  user: UserAccount;
}
