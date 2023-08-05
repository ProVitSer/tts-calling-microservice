import { Injectable } from '@nestjs/common';
import { TTSData, TTSProvider, TTSProviderInterface, TTSProviders, TTSVoiceFileData } from './interfaces/tts.interface';
import { TTSProviderType, VoiceFileFormat } from './interfaces/tts.enum';
import { YandexTTS } from './providers/yandex/yandex';
import { TinkoffTTS } from './providers/tinkoff/tinkoff';
import { ExecException, exec } from 'child_process';
import { FileUtilsService } from '@app/files/files-utils';

@Injectable()
export class TTSProviderService implements TTSProviderInterface {
  constructor(private readonly yandex: YandexTTS, private readonly tinkoff: TinkoffTTS) {}

  get provider(): TTSProviders {
    return {
      [TTSProviderType.yandex]: this.yandex,
      [TTSProviderType.tinkoff]: this.tinkoff,
    };
  }

  public async sendTextToTTS(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      const provider = this.getProvider(data.ttsType);
      const resultTTS = await provider.convertTextToRawVoiceFile(data);

      return await this.convertTTSVoiceFileToWav(resultTTS);
    } catch (e) {
      throw e;
    }
  }

  public getProvider(ttsType: TTSProviderType): TTSProvider {
    if (!(ttsType in this.provider)) throw new Error('');
    return this.provider[ttsType];
  }

  public async convertTTSVoiceFileToWav(data: TTSVoiceFileData): Promise<TTSVoiceFileData> {
    try {
      const wavFileName = await this._convertTTSVoiceFileToWav(data);
      return {
        fileName: wavFileName,
        generatedFileName: data.generatedFileName,
        fullFilePath: data.fullFilePath,
        format: VoiceFileFormat.wav,
      };
    } catch (e) {
      throw e;
    }
  }

  private async _convertTTSVoiceFileToWav(data: TTSVoiceFileData): Promise<string> {
    const wavFileName = `${data.generatedFileName}.${VoiceFileFormat.wav}`;
    const fullFileName = `${data.fullFilePath}${wavFileName}`;
    await new Promise((resolve, reject) => {
      exec(
        `sox -r 8000 -b 16 -e signed-integer -c 1 ${FileUtilsService.getFullFilePath(data)} ${fullFileName}`,
        (error: ExecException, stdout, stderr: string) => {
          if (error || stderr) {
            reject(error);
          }
          resolve(true);
        },
      );
    });
    return wavFileName;
  }
}
