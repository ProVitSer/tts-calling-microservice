import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  static sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
