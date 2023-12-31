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
        sampleRateHertz: TinkoffSpeechSampleRateHertz.Eight,
      },
      voice: {
        name: data?.voice ? (`${data.voice}:${data.emotion}` as TinkoffSpeechVoice) : TinkoffSpeechVoice.alyonaNeutral,
      },
    };
  }
}
