import { ApiProperty } from '@nestjs/swagger';
import { TTSProviderType, VoiceFileFormat } from './tts.enum';

export interface TTSData {
  ttsType: TTSProviderType;
  text: string;
}

export interface TTSBaseVoiceFileData {
  fileName: string;
  generatedFileName: string;
  fullFilePath: string;
}

export interface TTSConvertVoiceFileData extends TTSBaseVoiceFileData {
  format: VoiceFileFormat.wav;
}

export interface TTSProviderVoiceFileData extends TTSBaseVoiceFileData {
  format: VoiceFileFormat.raw;
  sampleRateHertz: number;
}

export interface TTSProviderInterface {
  sendTextToTTS(data: TTSData): Promise<TTSConvertVoiceFileData>;
  getProvider(ttsType: TTSProviderType): TTSProvider;
  convertTTSVoiceFileToWav(ttsType: TTSProviderType, data: TTSProviderVoiceFileData): Promise<TTSConvertVoiceFileData>;
  get provider(): TTSProviders;
}

export interface TTSProvider {
  convertTextToRawVoiceFile(data: TTSData): Promise<TTSProviderVoiceFileData>;
}

export type TTSProviders = {
  [key in TTSProviderType]: TTSProvider;
};

export class TTSFile {
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор голосового файла в системе', example: '64d1338f1364c0f30d949326' })
  fileId: string;
}
