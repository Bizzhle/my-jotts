import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
@Injectable()
export class ExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: Logger) {
    super();
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      return super.catch(exception, host);
    }

    const response = ctx.getResponse();

    this.logger.error(exception.message, ExceptionsFilter.name);

    const status = exception.getStatus();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //   timestamp: new Date().toISOString(),
      //   path: request.url,
      error: exception.message || 'Internal Server Error',
    });
  }
}
