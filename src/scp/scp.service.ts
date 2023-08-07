import { Injectable } from '@nestjs/common';
import { Client, ScpClient } from 'node-scp';
import { BaseScpConnect, UploadData } from './scp.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScpService {
  constructor(private readonly configService: ConfigService) {}
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
