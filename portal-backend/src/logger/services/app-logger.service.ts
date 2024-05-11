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
  log(message: string, context?: string) {
    // Add your custom logic here, for example, you can prepend a timestamp
    const timestamp = new Date().toISOString();
    super.log(`[${timestamp}] ${message}`, context);
  }

  // You can override other methods like error, warn, debug, verbose as needed
  error(message: any, trace?: string, context?: string) {
    // Add custom logic if necessary
    super.error(message, trace, context);
  }
  warn(message: string, context?: string) {
    // Add your custom logic here, for example, you can prepend a timestamp
    const timestamp = new Date().toISOString();
    super.warn(`${message}`, context);
  }
  debug(message: string, context?: string) {
    // Add your custom logic here, for example, you can prepend a timestamp
    const timestamp = new Date().toISOString();
    super.debug(` ${message}`, context);
  }
  verbose(message: string, context?: string) {
    // Add your custom logic here, for example, you can prepend a timestamp
    const timestamp = new Date().toISOString();
    super.log(`[${timestamp}] ${message}`, context);
  }
}
