import { Request } from 'express';
import { JwtPayload } from '../../utils/services/jwt-signing.services';

export interface RequestContext extends Request {
  tokenPayload: JwtPayload;
}
