import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class UtilsService {
  static sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static generateId(needUuid?: boolean): string {
    if (!!needUuid) {
      return uuid.v4();
    } else {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
  }
}
