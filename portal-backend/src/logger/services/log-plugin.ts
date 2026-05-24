import { ConfigService } from '@nestjs/config/dist/config.service';
import { BetterAuthPlugin } from 'better-auth/types';
import { ClsServiceManager } from 'nestjs-cls';
import { RequestContextService } from '../../utils/services/request-context.service';
import { AppLoggerService } from './app-logger.service';

const requestContextService = new RequestContextService(ClsServiceManager.getClsService());
const logger = new AppLoggerService('BetterAuth', null, new ConfigService(), requestContextService);

const getHeaderValue = (request: any, key: string): string | undefined => {
  const headers = request?.headers;
  if (!headers) return undefined;
  if (typeof headers.get === 'function') {
    return headers.get(key) ?? undefined;
  }
  const header = headers[key] ?? headers[key.toLowerCase()];
  return Array.isArray(header) ? header[0] : header;
};

export const BetterAuthLoggerPlugin = () => {
  return {
    id: 'loggerPlugin',
    onRequest: async (request, ctx) => {
      const { method, url } = request;
      const headerRequestId =
        getHeaderValue(request, 'x-header-id') ?? getHeaderValue(request, 'x-request-id');
      let requestId = headerRequestId;
      if (requestContextService.isRequestContextActive) {
        requestId = requestContextService.requestId;
      }

      requestId = requestId || crypto.randomUUID().slice(0, 8);

      // stash the request url (and method if useful) on the context so onResponse can access it
      (ctx as any).requestUrl = url;
      (ctx as any).requestMethod = method;
      (ctx as any).requestId = requestId;
    },
    onResponse: async (response, ctx) => {
      const { status } = response;
      const requestUrl = (ctx as any).requestUrl ?? ctx.baseURL;
      const requestId = (ctx as any).requestId;
      const requestPrefix = requestId ? `[${requestId}] ` : '';
      const message = `${requestPrefix}[BetterAuth] ← ${requestUrl} ${status}`;

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
