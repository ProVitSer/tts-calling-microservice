import { TTSData, TTSProvider, TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TinkoffTTS implements TTSProvider {
  convertTextToVoiceFile(data: TTSData): Promise<TTSVoiceFileData> {
    throw new Error('Method not implemented.');
  }
}
