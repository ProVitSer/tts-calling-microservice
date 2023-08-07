import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { access, constants, createWriteStream, createReadStream } from 'fs';
import { Files } from '../files/files.schema';
import { stat, chmod } from 'fs';
import { promisify } from 'util';

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

  public static async readStreamVoiceFile(fullFilePath: string) {
    return createReadStream(fullFilePath);
  }

  public static getFullFilePath(file: Files): string {
    return `${file.fullFilePath}${file.fileName}`;
  }

  public static async setFilePermissionsToFile(srcFilePath: string, dstFilePath: string): Promise<void> {
    const statAsync = promisify(stat);
    const chmodAsync = promisify(chmod);
    const sourceFileStats = await statAsync(srcFilePath);
    const sourceFilePermissions = sourceFileStats.mode;
    return await chmodAsync(dstFilePath, sourceFilePermissions);
  }
}
