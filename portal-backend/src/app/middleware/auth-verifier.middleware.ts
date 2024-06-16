import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from '../../users/services/user-auth/auth.services';
import { RequestWithUser } from '../../auth/request-with-user.interface';

@Injectable()
export class AuthVerifierMiddleWare implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
      const token = req.headers['authorization'].split(' ')[1];

      if (token) {
        const user = await this.authService.validateToken(token);

        req.userAccount = user;
      }
    }
    next();
  }
}
