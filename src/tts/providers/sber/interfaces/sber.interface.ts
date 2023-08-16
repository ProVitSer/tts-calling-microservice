import { CallCredentials, ChannelCredentials } from '@grpc/grpc-js';
import { SberContentType, SberSpeechFormat } from './sber.enum';

export interface SberTokenResponse {
  access_token: string;
  expires_at: number;
}

export type TokenData = SberTokenResponse;

export interface CreateAuthCredentials {
  channel: ChannelCredentials;
  call: CallCredentials;
}

export interface SynthesisRequest {
  text: string;
  audio_encoding: SberSpeechFormat;
  content_type: SberContentType;
  voice: string;
}
