import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private context = 'Calling-TTS';

  constructor(@Inject('winston') private readonly logger: winston.Logger) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: any): void {
    this.logger.log(message, { context: `${this.context}` });
  }

  info(message: any): void {
    this.logger.info(message, { context: `${this.context}` });
  }

  debug(message: string): void {
    this.logger.debug(message, { context: `${this.context}` });
  }

  warn(message: string): void {
    this.logger.warn(message, { context: `${this.context}` });
  }

  error(message: string): void {
    this.logger.error(message, { context: `${this.context}` });
  }
}
