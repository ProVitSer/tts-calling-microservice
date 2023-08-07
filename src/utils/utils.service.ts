import { Injectable, ValidationError } from '@nestjs/common';
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

  public static formatError(error: ValidationError): Array<{ field: string; error: { [type: string]: string } }> {
    const message: Array<{ field: string; error: { [type: string]: string } }> = [];

    function getChildren(childrenError: ValidationError, prop: string) {
      if (Array.isArray(childrenError.children) && childrenError.children.length != 0) {
        for (let i = 0; i < childrenError.children.length; i++) {
          getChildren(childrenError.children[i], `${prop}.${childrenError.children[i].property}`);
        }
      }
      !!childrenError.constraints ? message.push({ field: prop, error: childrenError.constraints }) : '';
    }

    getChildren(error, error.property);

    return message;
  }
}
