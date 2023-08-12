import { Injectable } from '@nestjs/common';
import {
  TTSData,
  TTSProvider,
  TTSProviderInterface,
  TTSProviders,
  TTSConvertVoiceFileData,
  TTSProviderVoiceFileData,
  ListVoicesData,
} from './interfaces/tts.interface';
import { TTSProviderType } from './interfaces/tts.enum';
import { YandexTTS } from './providers/yandex/yandex';
import { TinkoffTTS } from './providers/tinkoff/tinkoff';
import { PROVIDER_ERROR } from './tts.consts';
import { TTSConvertService } from './services/tts.convert.service';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class TTSProviderService implements TTSProviderInterface {
  constructor(
    private readonly logger: LoggerService,
    private readonly ttsConvertService: TTSConvertService,
    private readonly yandex: YandexTTS,
    private readonly tinkoff: TinkoffTTS,
  ) {}

  get provider(): TTSProviders {
    return {
      [TTSProviderType.yandex]: this.yandex,
      [TTSProviderType.tinkoff]: this.tinkoff,
    };
  }

  public async sendTextToTTS(data: TTSData): Promise<TTSConvertVoiceFileData> {
    try {
      const provider = this.getProvider(data.ttsType);
      await provider.checkVoiceEmotion(data);
      const resultTTS = await provider.convertTextToRawVoiceFile(data);

      return await this.convertTTSVoiceFileToWav(data.ttsType, resultTTS);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getVoicesList(ttsType: TTSProviderType): Promise<ListVoicesData[]> {
    try {
      const provider = this.getProvider(ttsType);
      return await provider.voiceList();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public getProvider(ttsType: TTSProviderType): TTSProvider {
    if (!(ttsType in this.provider)) throw PROVIDER_ERROR;
    return this.provider[ttsType];
  }

  public async convertTTSVoiceFileToWav(ttsType: TTSProviderType, data: TTSProviderVoiceFileData): Promise<TTSConvertVoiceFileData> {
    try {
      return await this.ttsConvertService.convertTTSVoiceFileToWav(ttsType, data);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
