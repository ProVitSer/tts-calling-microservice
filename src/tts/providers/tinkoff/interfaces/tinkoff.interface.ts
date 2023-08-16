import { CallCredentials, ChannelCredentials } from '@grpc/grpc-js';
import { TinkoffSpeechFormat, TinkoffSpeechSampleRateHertz, TinkoffSpeechVoice } from './tinkoff.enum';

export interface CreateAuthCredentials {
  channel: ChannelCredentials;
  call: CallCredentials;
}

export interface StreamingSynthesizeSpeechRequest {
  input: { text: string };
  audioConfig: {
    audioEncoding: TinkoffSpeechFormat;
    sampleRateHertz: TinkoffSpeechSampleRateHertz;
  };
  voice: {
    name: TinkoffSpeechVoice;
  };
}

export interface StreamingSynthesizeSpeechResponse {
  audioChunk: string;
}

export interface VoicesListData {
  voices: { name: string }[];
}
