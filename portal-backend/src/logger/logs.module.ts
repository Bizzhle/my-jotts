import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppLoggerService } from './services/app-logger.service';
import { LogsMiddleware } from './middlewares/log.middleware';
@Global()
@Module({
  providers: [AppLoggerService, LogsMiddleware],
  exports: [AppLoggerService, LogsMiddleware],
})
export class LogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
