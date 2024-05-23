import { Request } from 'express';
import { UserRole } from '../users/enums/roles.enum';
import { InitialLoginResponseDTO } from '../users/dto/initial-login-response.dto';

export interface RequestWithUser extends Request {
  user: InitialLoginResponseDTO;
}
