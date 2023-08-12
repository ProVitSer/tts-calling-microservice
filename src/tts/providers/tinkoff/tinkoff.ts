import { TTSData, TTSProvider, TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { Injectable } from '@nestjs/common';
import { TinkoffStreamingTTSDataAdapter } from './adapters/tinkoff.streaming.adapter';

import { TinkoffTTSService } from './services/tinkoff.service';

@Injectable()
export class TinkoffTTS implements TTSProvider {
  constructor(private readonly tinkoffTTSService: TinkoffTTSService) {}

  async convertTextToRawVoiceFile(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      return await this.tinkoffTTSService.streamingSynthesize(new TinkoffStreamingTTSDataAdapter(data));
    } catch (e) {
      throw e;
    }
  }
}
