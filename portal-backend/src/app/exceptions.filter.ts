import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';
import { Request, Response } from 'express';

@Catch()
@Injectable()
export class ExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: Logger) {
    super();
  }
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }

    if (!(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host);
    }
    this.logger.error(exception.message, ExceptionsFilter.name);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message || 'Internal Server Error',
    });
  }

  public handleUnknownError(exception: Error, host: ArgumentsHost) {
    const body = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
    };
    // ...
  }
}
