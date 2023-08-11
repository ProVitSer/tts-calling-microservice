import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private requestErrorMessage = null;
  private readonly requestStart = Date.now();

  constructor(private readonly logger: LoggerService) {}
  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;
      let data;

      try {
        data = JSON.stringify(request.body);
      } catch (error) {
        data = request.body;
      }
      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} ${data}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
