import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { UtilsModule } from '../utils/util.module';
import { LogsMiddleware } from './middlewares/log.middleware';
import { AppLoggerService } from './services/app-logger.service';
@Global()
@Module({
  imports: [UtilsModule],
  providers: [AppLoggerService, LogsMiddleware],
  exports: [AppLoggerService, LogsMiddleware],
})
export class LogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
