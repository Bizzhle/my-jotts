import { ConsoleLogger, ConsoleLoggerOptions, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import getLogLevels from '../../utils/get-log-levels';

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  constructor(context: string, options: ConsoleLoggerOptions, configService: ConfigService) {
    const environment = configService.get('NODE_ENV');
    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production'),
    });
  }
  // Override the log method
}
