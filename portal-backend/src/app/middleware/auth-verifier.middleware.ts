import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { auth } from '../../../auth';
import { RequestContextService } from '../../utils/services/request-context.service';

@Injectable()
export class AuthVerifierMiddleWare implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as unknown as Headers,
      });

      if (session?.user?.id) {
        this.requestContextService.setUserId(session.user.id);
        req['user'] = session.user;
      }
    } catch {
      // Session lookup failure is non-fatal; auth guards handle unauthorised access
    }

    next();
  }
}
