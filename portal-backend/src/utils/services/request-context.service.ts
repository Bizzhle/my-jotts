import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CLS_ID, CLS_REQ, ClsService, ClsStore } from 'nestjs-cls';

export interface RequestContextStore extends ClsStore {
  'user:id': string;
}

@Injectable()
export class RequestContextService {
  constructor(private readonly clsService: ClsService<RequestContextStore>) {}

  /**
   * Checks if the CLS context is currently active. This is useful to determine if the request context is available for use, which can help prevent errors when trying to access CLS data outside of an active request context.
   */
  get isRequestContextActive(): boolean {
    return this.clsService?.isActive?.() ?? false;
  }

  /**
   * Returns the current request object from the CLS context. This is useful for accessing request-specific data such as headers, params, etc. It relies on the CLS middleware to have been properly set up to store the request object in the CLS context under the CLS_REQ key.
   * @returns {Request} The current request object from the CLS context.
   * @throws {Error} If the CLS context is not active or if the request object is not found in the CLS context.
   */
  get request(): Request {
    return this.clsService.get(CLS_REQ);
  }

  /**
   * Returns the unique request ID from the CLS context. This is useful for logging and tracing requests across different parts of the application. It relies on the CLS middleware to have been properly set up to generate and store a unique request ID in the CLS context under the CLS_ID key.
   * @returns {string} The unique request ID from the CLS context.
   * @throws {Error} If the CLS context is not active or if the request ID is not found in the CLS context.
   */
  get requestId(): string {
    if (!this.request) {
      throw new Error('Request context is not active');
    }
    return this.clsService.get(CLS_ID);
  }

  setRequestId(requestId: string): void {
    if (this.isRequestContextActive) {
      this.clsService.set(CLS_ID, requestId);
      return;
    }

    this.clsService.enterWith({ [CLS_ID]: requestId } as unknown as RequestContextStore);
  }

  /**
   * Returns the IP address of the client making the request. This is useful for logging, auditing, and security purposes. It relies on the CLS middleware to have been properly set up to store the request object in the CLS context under the CLS_REQ key.
   * @returns {string | undefined} The IP address of the client making the request, or undefined if the request context is not active.
   */
  //   get ipAddress(): string | undefined {
  //     return this.request.clientIp || this.request.ip;
  //   }

  get userId(): string {
    if (!this.request) {
      throw new Error('Request context is not active');
    }
    return this.clsService.get('user:id');
  }

  setUserId(userId: string): void {
    if (this.isRequestContextActive) {
      this.clsService.set('user:id', userId);
      return;
    }

    this.clsService.enterWith({ 'user:id': userId } as unknown as RequestContextStore);
  }
}
