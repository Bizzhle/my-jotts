import { ConsoleLogger, ConsoleLoggerOptions, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import getLogLevels from '../../utils/get-log-levels';
import { RequestContextService } from '../../utils/services/request-context.service';

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    private readonly configService: ConfigService,
    private readonly requestContextService: RequestContextService,
  ) {
    const environment = configService.get('NODE_ENV');
    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production'),
    });
  }

  // slicedReqId = '';
  //   if (this.requestContextService.isRequestContextActive) {
  //     const { requestId: reqId } = this.requestContextService;
  //     slicedReqId = reqId.slice(0, 8) || '(none)  ';
  //   }

  // // Override the log method
  // log(message: string, context?: string) {
  //   // Add your custom logic here, for example, you can prepend a timestamp
  //   const timestamp = new Date().toISOString();
  //   super.log(`[${timestamp}] ${message}`, context);
  // }

  // // You can override other methods like error, warn, debug, verbose as needed
  // error(message: any, trace?: string, context?: string) {
  //   // Add custom logic if necessary
  //   super.error(message, trace, context);
  // }
  // warn(message: string, context?: string) {
  //   // Add your custom logic here, for example, you can prepend a timestamp
  //   const timestamp = new Date().toISOString();
  //   super.warn(`${message}`, context);
  // }
  // debug(message: string, context?: string) {
  //   // Add your custom logic here, for example, you can prepend a timestamp
  //   const timestamp = new Date().toISOString();
  //   super.debug(` ${message}`, context);
  // }
  // verbose(message: string, context?: string) {
  //   // Add your custom logic here, for example, you can prepend a timestamp
  //   const timestamp = new Date().toISOString();
  //   super.log(`[${timestamp}] ${message}`, context);
  // }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ) {
    let slicedReqId = '';
    if (this.requestContextService?.isRequestContextActive) {
      const reqId = this.requestContextService.requestId;
      slicedReqId = reqId.slice(0, 8) || '(none)  ';
    }

    const config = this.configService.get('NODE_ENV');

    const time = config === 'production' ? '' : this.getTimestamp() + ' ';

    const output = this.stringifyMessage(message, logLevel);

    pidMessage = this.colorize(pidMessage, logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);

    return `${time} ${formattedLogLevel} ${contextMessage} -  ${slicedReqId} ${output} +${timestampDiff}\n`;
  }
}
