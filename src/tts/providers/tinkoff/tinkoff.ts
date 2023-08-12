import { TTSData, TTSProvider, TTSProviderVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { Injectable } from '@nestjs/common';
import { TinkoffStreamingTTSDataAdapter } from './adapters/tinkoff.streaming.adapter';

import { TinkoffTTSService } from './services/tinkoff.service';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class TinkoffTTS implements TTSProvider {
  constructor(private readonly logger: LoggerService, private readonly tinkoffTTSService: TinkoffTTSService) {}

  async convertTextToRawVoiceFile(data: TTSData): Promise<TTSProviderVoiceFileData> {
    try {
      return await this.tinkoffTTSService.streamingSynthesize(new TinkoffStreamingTTSDataAdapter(data));
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
