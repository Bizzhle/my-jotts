import { Request } from 'express';
import { JwtPayload } from '../../users/services/user-service/jwt-signing.services';

export interface RequestContext extends Request {
  tokenPayload: JwtPayload;
}
