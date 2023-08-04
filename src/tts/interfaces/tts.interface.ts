import { TTSProviderType } from './tts.enum';

export interface TTSData {
  id: string;
  ttsType: TTSProviderType;
  text: string;
}

export interface TTSVoiceFileData {
  id: string;
  fileName: string;
  filePath: string;
}

export interface TTSProviderInterface {
  sendTextToTTS(data: TTSData): Promise<TTSVoiceFileData>;
  getProvider(ttsType: TTSProviderType): TTSProvider;
  get provider(): TTSProviders;
}

export interface TTSProvider {
  convertTextToVoiceFile(data: TTSData): Promise<TTSVoiceFileData>;
}

export type TTSProviders = {
  [key in TTSProviderType]: TTSProvider;
};
