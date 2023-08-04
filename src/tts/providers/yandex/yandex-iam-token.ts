import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExecException, exec } from 'child_process';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class YandexIAMToken implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const iamToken = await this.refreshIAMToken();
    await this.saveToken(iamToken);
  }

  public async refreshIAMToken(): Promise<string> {
    try {
      const token = await new Promise<string>(function (resolve, reject) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        exec('yc iam create-token', (error: ExecException, stdout, stderr: string) => {
          if (!!stdout) {
            resolve(stdout.replace(/\n/g, ''));
          }
          reject(error);
        });
      });
      await this.saveToken(token);
      return token;
    } catch (e) {
      throw e;
    }
  }

  public async getIAMToken(): Promise<string> {
    const token = JSON.parse(
      (await readFile(`${join(__dirname, '..', this.configService.get('yandex.tokenFolder'))}/token.json`)).toString(),
    );
    return token.iamToken;
  }

  private async saveToken(token: string): Promise<void> {
    await writeFile(
      `${join(__dirname, '..', this.configService.get('yandex.tokenFolder'))}/token.json`,
      JSON.stringify({ iamToken: token }),
    );
  }
}
