import { ConfigService } from '@nestjs/config/dist/config.service';
import { BetterAuthPlugin } from 'better-auth/types';
import { AppLoggerService } from './app-logger.service';

const logger = new AppLoggerService('BetterAuth', null, new ConfigService());

export const BetterAuthLoggerPlugin = () => {
  return {
    id: 'loggerPlugin',
    onRequest: async (request, ctx) => {
      const { method, url } = request;
      // stash the request url (and method if useful) on the context so onResponse can access it
      (ctx as any).requestUrl = url;
      (ctx as any).requestMethod = method;
    },
    onResponse: async (response, ctx) => {
      const { status } = response;
      const requestUrl = (ctx as any).requestUrl ?? ctx.baseURL;
      const message = `[BetterAuth] ← ${requestUrl} ${status}`;

      if (status === 201 || status === 200) {
        return logger.log('RESPONSE', message);
      }

      if (status >= 500) {
        return logger.error(`[BetterAuth] ← ${requestUrl} ${status}`);
      }

      if (status >= 400) {
        return logger.warn(`[BetterAuth] ← ${requestUrl} ${status}`);
      }

      return logger.log(`[BetterAuth] ← ${requestUrl} ${status}`);
    },
  } satisfies BetterAuthPlugin;
};
