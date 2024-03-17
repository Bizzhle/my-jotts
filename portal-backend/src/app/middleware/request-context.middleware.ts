import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import CustomRequest from './custom-request-interface';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    // Set request-specific context here
    // For example, you can set user information from headers, cookies, etc.
    console.log(req.context);
  }
}
