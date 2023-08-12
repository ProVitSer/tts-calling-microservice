import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TinkoffGRPCClient } from '../grpc/tinkoff.grpc.client';
import * as uuid from 'uuid';
import { TinkoffStreamingTTSDataAdapter } from '../adapters/tinkoff.streaming.adapter';
import { TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { FileUtilsService } from '@app/utils/files.utils';
import { VoiceFileFormat } from '@app/tts/interfaces/tts.enum';
import { LoggerService } from '@app/logger/logger.service';
import { StreamingSynthesizeSpeechResponse } from '../interfaces/tinkoff.interface';

@Injectable()
export class TinkoffTTSService {
  private readonly voicePath: string;
  private readonly fileName: string = `tinkoff-${uuid.v4()}.raw`;
  constructor(
    private readonly configService: ConfigService,
    private readonly tinkoffClient: TinkoffGRPCClient,
    private readonly logger: LoggerService,
  ) {
    this.voicePath = this.configService.get('voiceFileDir');
  }

  public async streamingSynthesize(data: TinkoffStreamingTTSDataAdapter): Promise<TTSVoiceFileData> {
    try {
      const ttsClient = this.getTTSClient();
      const ttsStreamingCall = ttsClient.StreamingSynthesize({ ...data.streamingData });
      await this.writeTtsStreamingCall(ttsStreamingCall, ttsClient);
      return {
        fileName: this.fileName,
        generatedFileName: this.fileName.slice(0, this.fileName.lastIndexOf('.')),
        fullFilePath: FileUtilsService.getFullPath(this.voicePath),
        format: VoiceFileFormat.raw,
      };
    } catch (e) {
      throw e;
    }
  }

  private getTTSClient() {
    return this.tinkoffClient.createTtsClient();
  }

  private async writeTtsStreamingCall(ttsStreamingResponse: any, ttsClient: any) {
    const writer = await FileUtilsService.writeStreamVoiceFile(this.fileName, this.voicePath);
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
