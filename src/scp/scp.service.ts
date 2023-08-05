import { Injectable } from '@nestjs/common';
import { Client, ScpClient } from 'node-scp';
import { BaseScpConnect, UploadData } from './scp.interface';

@Injectable()
export class ScpService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  public async uploadFileToServer(uploadData: UploadData): Promise<void> {
    try {
      const client = await this.getClient(uploadData);
      return await client.uploadFile(uploadData.uploadFilePath, uploadData.serverFilePath);
    } catch (e) {
      throw e;
    }
  }

  private async getClient(data: BaseScpConnect): Promise<ScpClient> {
    return await Client({
      host: data.host,
      port: data.port,
      username: data.username,
      password: data.password,
    });
  }
}
