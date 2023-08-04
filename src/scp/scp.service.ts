import { Injectable } from '@nestjs/common';
import { Client, ScpClient } from 'node-scp';
import { BaseScpConnect, UploadData } from './scp.interface';

@Injectable()
export class ScpService {
  public async uploadFileToServer(uploadData: UploadData): Promise<void> {
    try {
      const client = await this.getClient(uploadData);
      console.log(uploadData.uploadFilePath);
      console.log(uploadData.serverFilePath);

      return client.uploadFile(uploadData.uploadFilePath, uploadData.serverFilePath);
    } catch (e) {
      console.log(e);

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
