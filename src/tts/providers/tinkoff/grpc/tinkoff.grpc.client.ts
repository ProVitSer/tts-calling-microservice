import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { loadPackageDefinition, GrpcObject, credentials } from '@grpc/grpc-js';
import { TinkoffGRPCAuth } from './tinkoff.grpc.auth';
import { CreateAuthCredentials } from '../interfaces/tinkoff.interface';

@Injectable()
export class TinkoffGRPCClient implements OnModuleInit {
  private readonly apiKey: string;
  private readonly secretKey: string;
  private ttsProto: GrpcObject;
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('tinkoff.apiKey');
    this.secretKey = this.configService.get('tinkoff.secretKey');
  }

  onModuleInit() {
    this.ttsProto = this.createProto();
  }

  public createTtsClient() {
    const service = this.ttsProto.tinkoff['cloud'].tts.v1;
    const cred = this.createAuthCredentials();
    return new service.TextToSpeech(this.configService.get('tinkoff.url'), credentials.combineChannelCredentials(cred.channel, cred.call));
  }

  private createAuthCredentials(): CreateAuthCredentials {
    return {
      channel: credentials.createSsl(),
      call: credentials.createFromMetadataGenerator(TinkoffGRPCAuth.jwtMetadataGenerator(this.apiKey, this.secretKey)),
    };
  }

  private createProto(): GrpcObject {
    const packageDefinition = loadSync([join(__dirname, '../proto/tts/v1/tts.proto')], {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    return loadPackageDefinition(packageDefinition);
  }
}
