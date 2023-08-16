import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { loadPackageDefinition, GrpcObject, credentials } from '@grpc/grpc-js';

import { Metadata } from '@grpc/grpc-js';
import { SberTokenService } from '../services/sber.token.service';
import { CreateAuthCredentials } from '../interfaces/sber.interface';

@Injectable()
export class SberGRPCClient {
  constructor(private readonly configService: ConfigService, private readonly sberTokenService: SberTokenService) {}

  public async createTtsClient() {
    const proto = this.createProto();
    const cred = await this.createAuthCredentials();

    return new proto['smartspeech']['synthesis']['v1']['SmartSpeech'](
      this.configService.get('sber.url'),
      credentials.combineChannelCredentials(cred.channel, cred.call),
    );
  }
  private createProto(): GrpcObject {
    const packageDefinition = loadSync([join(__dirname, '../proto/smartspeech/synthesis/v1/synthesis.proto')], {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    return loadPackageDefinition(packageDefinition);
  }

  private async createAuthCredentials(): Promise<CreateAuthCredentials> {
    return {
      channel: credentials.createSsl(),
      call: credentials.createFromMetadataGenerator(await this.getMeta()),
    };
  }

  private async getMeta() {
    const token = await this.sberTokenService.getAccessToken();
    return (params: any, callback: any) => {
      const metadata = new Metadata();
      metadata.set('authorization', 'Bearer ' + token);
      callback(null, metadata);
    };
  }
}
