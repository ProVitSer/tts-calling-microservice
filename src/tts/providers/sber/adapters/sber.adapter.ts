import { TTSData } from '@app/tts/interfaces/tts.interface';
import { SberContentType, SberSpeechFormat, SberSpeechSampleRateHertz, SberSpeechVoice } from '../interfaces/sber.enum';
import { SynthesisRequest } from '../interfaces/sber.interface';

export class SberSpeechDataAdapter {
  public synthesisRequestData: SynthesisRequest;
  public sampleRateHertz: number;
  constructor(data: TTSData) {
    this.synthesisRequestData = {
      text: data.text,
      content_type: SberContentType.text,
      voice: data.voice ? `${data.voice}_${SberSpeechSampleRateHertz.Eight}` : `${SberSpeechVoice.Nec}_${SberSpeechSampleRateHertz.Eight}`,
      audio_encoding: SberSpeechFormat.pcm,
    };
    this.sampleRateHertz = Number(SberSpeechSampleRateHertz.Eight);
  }
}
