import type { GraphMainError } from '@/service/message/type';

export type ErrorCode = 'Login' | 'Server' | 'Service' | 'Context' | 'XlsxValidate';

interface ErrorOptions {
  cause?: Error;
  details?: unknown;
}

export type SURUMEError = {
  code: ErrorCode;
  name?: string;
  message: string;
  options?: ErrorOptions;
};

export const errorMapper = (surumeError: SURUMEError): Error => {
  switch (surumeError.code) {
    case 'Login':
      return new LoginError(surumeError.message, surumeError.options);
    case 'Server':
      return new ServerError(surumeError.message, surumeError.options);
    case 'Service':
      return new ServiceError(surumeError.message, surumeError.options);
    case 'Context':
      return new ContextError(surumeError.message, surumeError.options);
    case 'XlsxValidate':
      return new ExcelError(surumeError.message, surumeError.options);
    default:
      return new Error('undefined code');
  }
};

export class LoginError extends Error {
  options?: ErrorOptions;
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    this.name = 'LoginError';
    this.options = options;
  }
}

export class ContextError extends Error {
  options?: ErrorOptions;
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    this.name = 'Context';
    this.options = options;
  }
}

export class ServiceError extends Error {
  options?: ErrorOptions;
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    this.name = 'Service';
    this.options = options;
  }
}

export class ServerError extends Error {
  options?: ErrorOptions;
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    this.name = 'Server';
    this.options = options;
  }
}

export class ExcelError extends Error {
  options?: ErrorOptions;
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    this.name = 'ExcelValidate';
    this.options = options;
  }
}

/**
 * Graph API Error
 */

export class GraphError extends Error {
  code: string;
  target?: string | null;
  details?: {
    code: string;
    message: string;
    target?: string | null;
  }[];
  innerError?: {
    'request-id'?: string | null;
    'client-request-id'?: string | null;
    date?: string | null;
    '@odata.type': string;
  };

  constructor(error: GraphMainError) {
    super(error.message);

    this.name = 'GraphError';
    this.code = error.code;
    this.target = error.target;
    this.details = error.details;
    this.innerError = error.innerError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GraphError);
    }
  }
}
