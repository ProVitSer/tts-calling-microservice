import { ApiProperty } from '@nestjs/swagger';
import { TTSProviderType, VoiceFileFormat } from './tts.enum';

export interface TTSData {
  ttsType: TTSProviderType;
  text: string;
  voice?: string;
  emotion?: string;
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
export class ListVoicesData {
  @ApiProperty({ type: 'string', description: 'Название голоса', example: 'alyona' })
  name: string;

  @ApiProperty({ type: [String], description: 'Задание амплуа', example: '["flirt","funny","sad"]' })
  emotions: string[];
}

export interface TTSProviderInterface {
  sendTextToTTS(data: TTSData): Promise<TTSConvertVoiceFileData>;
  getProvider(ttsType: TTSProviderType): TTSProvider;
  convertTTSVoiceFileToWav(ttsType: TTSProviderType, data: TTSProviderVoiceFileData): Promise<TTSConvertVoiceFileData>;
  get provider(): TTSProviders;
}

export interface TTSProvider {
  convertTextToRawVoiceFile(data: TTSData): Promise<TTSProviderVoiceFileData>;
  checkVoiceEmotion(data: TTSData): Promise<void>;
  voiceList(): Promise<ListVoicesData[]>;
}

export type TTSProviders = {
  [key in TTSProviderType]: TTSProvider;
};

export class TTSFile {
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор голосового файла в системе', example: '64d1338f1364c0f30d949326' })
  fileId: string;
}
