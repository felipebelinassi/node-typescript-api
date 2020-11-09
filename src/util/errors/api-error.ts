import httpStatusCodes from 'http-status-codes';

export interface APIError {
  message: string;
  key?: string;
  code: number;
  description?: string;
  documentation?: string;
}

export interface APIErrorResponse extends Omit<APIError, 'key'> {
  error: string;
}

export default class ApiError {
  public static format(error: APIError): APIErrorResponse {
    return {
      message: error.message,
      code: error.code,
      error: error.key || httpStatusCodes.getStatusText(error.code),
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}
