import { Injectable } from '@nestjs/common';
import { TTSData, TTSVoiceFileData } from './interfaces/tts.interface';
import { TTSProviderService } from './tts.provider';

@Injectable()
export class TTSService {
  constructor(private readonly ttsProvider: TTSProviderService) {}
  public async textToSpech(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      return await this.ttsProvider.sendTextToTTS(data);
    } catch (e) {
      console.log(e);
    }
  }
}
