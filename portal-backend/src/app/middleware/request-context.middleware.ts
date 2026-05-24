import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { RequestContext } from './request.context.interface';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestContext, res: Response, next: NextFunction) {
    const headerId =
      this.getHeaderValue(req, 'x-header-id') ?? this.getHeaderValue(req, 'x-request-id');
    const requestId = headerId || randomUUID();

    req.headers['x-header-id'] = requestId;
    req.headers['x-request-id'] = requestId;
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    // req.context = {
    //   ...(req.context ?? {}),
    //   requestId,
    // };

    next();
  }

  private getHeaderValue(req: Request, key: string): string | undefined {
    const header = req.headers[key] ?? req.headers[key.toLowerCase()];
    if (Array.isArray(header)) {
      return header[0];
    }

    return typeof header === 'string' && header.length > 0 ? header : undefined;
  }
}
