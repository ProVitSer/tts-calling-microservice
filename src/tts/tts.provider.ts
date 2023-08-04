import { Injectable } from '@nestjs/common';
import { TTSData, TTSProvider, TTSProviderInterface, TTSProviders, TTSVoiceFileData } from './interfaces/tts.interface';
import { TTSProviderType } from './interfaces/tts.enum';
import { YandexTTS } from './providers/yandex/yandex';
import { TinkoffTTS } from './providers/tinkoff/tinkoff';

@Injectable()
export class TTSProviderService implements TTSProviderInterface {
  constructor(private readonly yandex: YandexTTS, private readonly tinkoff: TinkoffTTS) {}

  get provider(): TTSProviders {
    return {
      [TTSProviderType.yandex]: this.yandex,
      [TTSProviderType.tinkoff]: this.tinkoff,
    };
  }

  sendTextToTTS(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      const provider = this.getProvider(data.ttsType);
      return provider.convertTextToVoiceFile(data);
    } catch (e) {
      throw e;
    }
  }

  getProvider(ttsType: TTSProviderType): TTSProvider {
    if (!(ttsType in this.provider)) throw new Error('');
    return this.provider[ttsType];
  }
}
