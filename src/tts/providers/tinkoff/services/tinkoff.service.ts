import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TinkoffGRPCClient } from '../grpc/tinkoff.grpc.client';
import * as uuid from 'uuid';
import { TinkoffStreamingTTSDataAdapter } from '../adapters/tinkoff.streaming.adapter';
import { TTSProviderVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { FileUtilsService } from '@app/utils/files.utils';
import { VoiceFileFormat } from '@app/tts/interfaces/tts.enum';
import { LoggerService } from '@app/logger/logger.service';
import { StreamingSynthesizeSpeechResponse } from '../interfaces/tinkoff.interface';

@Injectable()
export class TinkoffTTSService {
  private readonly voicePath: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly tinkoffClient: TinkoffGRPCClient,
    private readonly logger: LoggerService,
  ) {
    this.voicePath = this.configService.get('voiceFileDir');
  }

  public async streamingSynthesize(dataAdapte: TinkoffStreamingTTSDataAdapter): Promise<TTSProviderVoiceFileData> {
    try {
      const ttsClient = this.getTTSClient();
      const ttsStreamingCall = ttsClient.StreamingSynthesize({ ...dataAdapte.streamingData });
      const fileName = `tinkoff-${uuid.v4()}.${VoiceFileFormat.raw}`;
      await this.writeStreamVoiceFile(ttsStreamingCall, ttsClient, fileName);
      return {
        fileName,
        generatedFileName: fileName.slice(0, fileName.lastIndexOf('.')),
        fullFilePath: FileUtilsService.getFullPath(this.voicePath),
        format: VoiceFileFormat.raw,
        sampleRateHertz: dataAdapte.streamingData.audioConfig.sampleRateHertz,
      };
    } catch (e) {
      throw e;
    }
  }

  private getTTSClient() {
    return this.tinkoffClient.createTtsClient();
  }

  private async writeStreamVoiceFile(ttsStreamingResponse: any, ttsClient: any, fileName: string) {
    const writer = await FileUtilsService.writeStreamVoiceFile(fileName, this.voicePath);
    await new Promise((resolve, reject) => {
      ttsStreamingResponse.on('status', (status) => {
        if (status.code == 0) {
          ttsClient.close();
          resolve(true);
        }
        reject(status);
      });
      ttsStreamingResponse.on('error', (error: any) => {
        this.logger.error(error);
        reject(error);
      });
      ttsStreamingResponse.on('data', (response: StreamingSynthesizeSpeechResponse) => {
        if (response && response.audioChunk && response.audioChunk.length > 0) {
          writer.write(Buffer.from(response.audioChunk));
        }
      });
    });
  }
}
