import { ListVoicesData, TTSData, TTSProvider, TTSProviderVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SberService } from './services/sber.service';
import { SberSpeechDataAdapter } from './adapters/sber.adapter';
import { SberSpeechVoice } from './interfaces/sber.enum';
import { EMOTION_ERROR, VOICE_ERROR } from '@app/tts/tts.consts';

@Injectable()
export class SberTTS implements TTSProvider {
  constructor(private readonly sberService: SberService) {}
  public async convertTextToRawVoiceFile(data: TTSData): Promise<TTSProviderVoiceFileData> {
    try {
      return await this.sberService.streamingSynthesize(new SberSpeechDataAdapter(data));
    } catch (e) {
      throw e;
    }
  }

  public async checkVoiceEmotion(data: TTSData): Promise<void> {
    const { voice, emotion } = data;
    if (voice) {
      const yandexSpeechVoicesArray = Object.values(SberSpeechVoice) as SberSpeechVoice[];
      if (!yandexSpeechVoicesArray.includes(voice as SberSpeechVoice)) {
        throw new BadRequestException(`${VOICE_ERROR} ${voice}`);
      }

      if (emotion !== 'neutral') throw new BadRequestException(`${EMOTION_ERROR} ${emotion} для голоса ${voice}`);
    }
  }

  public async voiceList(): Promise<ListVoicesData[]> {
    const sberSpeechVoicesArray: SberSpeechVoice[] = Object.values(SberSpeechVoice);
    const result: ListVoicesData[] = sberSpeechVoicesArray.map((v: SberSpeechVoice) => {
      return {
        name: v,
        emotions: ['neutral'],
      };
    });
    return result;
  }
}
