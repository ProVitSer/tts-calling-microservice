import { ListVoicesData, TTSData, TTSProvider, TTSProviderVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { YandexSpeechDataAdapter } from './adapters/yandex.adapter';
import { YandexService } from './services/yandex.service';
import { YandexSpeechEmotion, YandexSpeechVoice } from './interfaces/yandex.enum';
import { VOICE_ERROR, EMOTION_ERROR } from '@app/tts/tts.consts';
import { VOICE_EMOTION_MAP } from './yandex.consts';

@Injectable()
export class YandexTTS implements TTSProvider {
  constructor(private readonly yandexService: YandexService) {}

  public async convertTextToRawVoiceFile(data: TTSData): Promise<TTSProviderVoiceFileData> {
    try {
      return await this.yandexService.streamingSynthesize(new YandexSpeechDataAdapter(data));
    } catch (e) {
      throw e;
    }
  }

  public async checkVoiceEmotion(data: TTSData): Promise<void> {
    const { voice, emotion } = data;
    if (voice) {
      const yandexSpeechVoicesArray = Object.values(YandexSpeechVoice) as YandexSpeechVoice[];
      if (!yandexSpeechVoicesArray.includes(voice as YandexSpeechVoice)) {
        throw new BadRequestException(`${VOICE_ERROR} ${voice}`);
      }

      if (emotion) {
        const yandexSpeechEmotionArray = VOICE_EMOTION_MAP[voice];
        if (!yandexSpeechEmotionArray.includes(emotion as YandexSpeechEmotion)) {
          throw new BadRequestException(`${EMOTION_ERROR} ${emotion} для голоса ${voice}`);
        }
      }
    }
  }

  public async voiceList(): Promise<ListVoicesData[]> {
    const yandexSpeechVoicesArray: YandexSpeechVoice[] = Object.values(YandexSpeechVoice);
    const result: ListVoicesData[] = yandexSpeechVoicesArray.map((v: YandexSpeechVoice) => {
      return {
        name: v,
        emotions: VOICE_EMOTION_MAP[v],
      };
    });
    return result;
  }
}
