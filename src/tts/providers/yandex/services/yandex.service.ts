import { LoggerService } from '@app/logger/logger.service';
import { TTSProviderVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import { YandexSpeechDataAdapter } from '../adapters/yandex.adapter';
import { YandexHttService } from './yandex.http.service';
import { FileUtilsService } from '@app/utils/files.utils';
import { AxiosResponse } from 'axios';
import { VoiceFileFormat } from '@app/tts/interfaces/tts.enum';

@Injectable()
export class YandexService {
  private readonly voicePath: string;
  constructor(private readonly configService: ConfigService, private readonly yandexHttService: YandexHttService) {
    this.voicePath = this.configService.get('voiceFileDir');
  }

  public async streamingSynthesize(dataAdapter: YandexSpeechDataAdapter): Promise<TTSProviderVoiceFileData> {
    try {
      const fileName = await this.getTTSFile(dataAdapter);
      return {
        fileName,
        generatedFileName: fileName.slice(0, fileName.lastIndexOf('.')),
        fullFilePath: FileUtilsService.getFullPath(this.voicePath),
        format: VoiceFileFormat.raw,
        sampleRateHertz: Number(dataAdapter.sampleRateHertz),
      };
    } catch (e) {
      throw e;
    }
  }

  private async getTTSFile(dataAdapter: YandexSpeechDataAdapter): Promise<string> {
    try {
      const fileName = `yandex-${uuid.v4()}.${VoiceFileFormat.raw}`;
      const response = await this.yandexHttService.request(dataAdapter);
      await this.writeStreamVoiceFile(response, fileName);
      return fileName;
    } catch (e) {
      throw e;
    }
  }

  private async writeStreamVoiceFile(response: AxiosResponse, fileName: string): Promise<boolean> {
    console.log(response);
    const writer = await FileUtilsService.writeStreamVoiceFile(fileName, this.voicePath);
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;

      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  }
}
