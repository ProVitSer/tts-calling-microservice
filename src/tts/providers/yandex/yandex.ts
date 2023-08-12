import { TTSData, TTSProvider, TTSProviderVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { Injectable } from '@nestjs/common';
import { YandexSpeechDataAdapter } from './adapters/yandex.adapter';
import { YandexService } from './services/yandex.service';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class YandexTTS implements TTSProvider {
  constructor(private readonly logger: LoggerService, private readonly yandexService: YandexService) {}

  public async convertTextToRawVoiceFile(data: TTSData): Promise<TTSProviderVoiceFileData> {
    try {
      return await this.yandexService.streamingSynthesize(new YandexSpeechDataAdapter(data));
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }
}
