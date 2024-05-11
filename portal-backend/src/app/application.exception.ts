export class ApplicationException extends Error {
  errorCode = 500;
  originalError?: Error;

  constructor(message?: string, originalError?: Error, statusCode?: number) {
    super(message);
    this.originalError = originalError;
    this.errorCode = statusCode || 500;
  }
}
