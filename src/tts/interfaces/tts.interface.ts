import { ApiProperty } from '@nestjs/swagger';
import { TTSProviderType, VoiceFileFormat } from './tts.enum';

export interface TTSData {
  ttsType: TTSProviderType;
  text: string;
}

export interface TTSVoiceFileData {
  fileName: string;
  generatedFileName: string;
  fullFilePath: string;
  format?: VoiceFileFormat;
}

export interface TTSProviderInterface {
  sendTextToTTS(data: TTSData): Promise<TTSVoiceFileData>;
  getProvider(ttsType: TTSProviderType): TTSProvider;
  convertTTSVoiceFileToWav(data: TTSVoiceFileData): Promise<TTSVoiceFileData>;
  get provider(): TTSProviders;
}

export interface TTSProvider {
  convertTextToRawVoiceFile(data: TTSData): Promise<TTSVoiceFileData>;
}

export type TTSProviders = {
  [key in TTSProviderType]: TTSProvider;
};

export class TTSFile {
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор голосового файла в системе', example: '64d1338f1364c0f30d949326' })
  fileId: string;
}
