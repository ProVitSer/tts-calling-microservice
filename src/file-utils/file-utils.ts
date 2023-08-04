import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { access, constants, createWriteStream } from 'fs';

@Injectable()
export class FileUtilsService {
  public static async exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      access(path, constants.F_OK, (error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public static async writeStreamVoiceFile(fileName: string, filePath: string) {
    return createWriteStream(`${join(__dirname, '..', filePath)}${fileName}`);
  }

  public static getFullPath(filePath: string): string {
    return join(__dirname, '..', filePath);
  }
}
