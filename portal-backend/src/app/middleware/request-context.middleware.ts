import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestContext } from './request.context.interface';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestContext, res: Response, next: NextFunction) {
    // Set request-specific context here
    // For example, you can set user information from headers, cookies, etc.
    const user = req.user;

    next();
  }
}
