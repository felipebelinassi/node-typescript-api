import { InternalError } from './internal-error';

export class ForecastProcessingError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error processing the forecast';
    super(`${internalMessage}: ${message}`);
  }
}
