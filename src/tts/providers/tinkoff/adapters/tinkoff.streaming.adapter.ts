import { TTSData } from '@app/tts/interfaces/tts.interface';
import { StreamingSynthesizeSpeechRequest } from '../interfaces/tinkoff.interface';
import { TinkoffSpeechFormat, TinkoffSpeechSampleRateHertz, TinkoffSpeechVoice } from '../interfaces/tinkoff.enum';

export class TinkoffStreamingTTSDataAdapter {
  streamingData: StreamingSynthesizeSpeechRequest;
  constructor(data: TTSData) {
    this.streamingData = {
      input: { text: data.text },
      audioConfig: {
        audioEncoding: TinkoffSpeechFormat.linear,
        sampleRateHertz: TinkoffSpeechSampleRateHertz.FortyEight,
      },
      voice: {
        name: TinkoffSpeechVoice.alyonaFunny,
      },
    };
  }
}
