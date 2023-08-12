import { TTSData, TTSProvider, TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { ClientProxyFactory, GrpcOptions } from '@nestjs/microservices';
import { credentials, Metadata, loadPackageDefinition, GrpcObject } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { FileUtilsService } from '@app/utils/files.utils';
import { createWriteStream } from 'fs';
import * as crypto from 'crypto';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
export class TinkoffTTS implements TTSProvider {
  constructor(private readonly configSevice: ConfigService) {}
  // constructor(@Inject('TINKOFF_TTS') private tinkoffTTS: ClientGrpc) {}

  async onModuleInit() {
    // const apiKey = this.configSevice.get('tinkoff.apiKey');
    // const secretKey = this.configSevice.get('tinkoff.secretKey');
    // const packageDefinition = loadSync([join(__dirname, 'proto/tts/v1/tts.proto')], {
    //   keepCase: false,
    //   longs: String,
    //   enums: String,
    //   defaults: true,
    //   oneofs: true,
    // });
    // console.log('onModuleInit');
    // const grpcObj = loadPackageDefinition(packageDefinition);
    // const ttsProto = grpcObj.tinkoff['cloud'].tts.v1;
    // const channelCredentials = credentials.createSsl();
    // const callCredentials = credentials.createFromMetadataGenerator(jwtMetadataGenerator(apiKey, secretKey, 'test_issuer', 'test_subject'));
    // this.ttsClient = new ttsProto.TextToSpeech(
    //   'api.tinkoff.ai:443',
    //   credentials.combineChannelCredentials(channelCredentials, callCredentials),
    // );
  }

  async convertTextToRawVoiceFile(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      // await new Promise(async (resolve, reject) => {
      let GOT_DATA = false;
      const writer = createWriteStream('./out.raw', { autoClose: true, encoding: 'utf8', flags: 'w' });
      const apiKey = this.configSevice.get('tinkoff.apiKey');
      const secretKey = this.configSevice.get('tinkoff.secretKey');

      const packageDefinition = loadSync([join(__dirname, 'proto/tts/v1/tts.proto')], {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      console.log('onModuleInit');

      const grpcObj = loadPackageDefinition(packageDefinition);
      const ttsProto = grpcObj.tinkoff['cloud'].tts.v1;
      const channelCredentials = credentials.createSsl();
      const callCredentials = credentials.createFromMetadataGenerator(
        jwtMetadataGenerator(apiKey, secretKey, 'test_issuer', 'test_subject'),
      );
      const ttsClient = new ttsProto.TextToSpeech(
        'api.tinkoff.ai:443',
        credentials.combineChannelCredentials(channelCredentials, callCredentials),
      );

      ttsClient.ListVoices({ language_code: 'ru-RU' }, function (err, response) {
        if (err) {
          console.error('ListVoices error: code #%d msg %s', err.code, err.message);
        } else {
          console.log('ListVoices', response);
        }
      });

      const ttsStreamingCall = ttsClient.StreamingSynthesize({
        input: { text: 'Привет, как дела?' },
        audioConfig: {
          audioEncoding: 'LINEAR16',
          sampleRateHertz: 48000,
        },
        voice: {
          language_code: 'ru-RU',
        },
      });
      console.log(ttsStreamingCall);

      ttsStreamingCall.on('metadata', (metadata) => console.log('Initial response metadata', metadata));
      ttsStreamingCall.on('status', (status) => {
        console.log('Call ended, status', status);
        ttsClient.close();
        //resolve(true);
      });
      ttsStreamingCall.on('error', (error) => console.error('Error', error));

      ttsStreamingCall.on('data', (response) => {
        if (response && response.audioChunk && response.audioChunk.length > 0) {
          console.log('got ' + response.audioChunk.length + ' bytes of audio data');
          writer.write(Buffer.from(response.audioChunk));

          if (GOT_DATA === false) {
            GOT_DATA = true;
          }
        } else {
          console.log('No audio data in response:', response);
        }
      });

      throw new Error('Method not implemented.');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
function jwtMetadataGenerator(apiKey: string, secretKey: string, issuer?: string, subject?: string) {
  return (params: any, callback: any) => {
    const authPayload = {
      iss: issuer,
      sub: subject,
      aud: params['service_url'].split('/').pop(),
    };

    const token = generateJwt(apiKey, secretKey, authPayload);
    const metadata = new Metadata();
    metadata.set('authorization', 'Bearer ' + token);
    callback(null, metadata);
  };
}

function generateJwt(apiKey: string, secretKey: string, payload: { [key: string]: any }): string {
  const expirationTime = 600;
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: apiKey,
  };
  payload['exp'] = Math.floor(Date.now() / 1000) + expirationTime;
  const headerBytes = JSON.stringify(header);
  const payloadBytes = JSON.stringify(payload);
  const data = UtilsService.base64Encode(headerBytes) + '.' + UtilsService.base64Encode(payloadBytes);
  const hmac = crypto.createHmac('sha256', UtilsService.base64Decode(secretKey)).update(data, 'utf8').digest();
  const signature = UtilsService.base64Encode(hmac as unknown as string);
  return data + '.' + signature;
}
