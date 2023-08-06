import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CallingTTSTaskDTO {
  @IsString()
  @IsNotEmpty()
  tts: string;

  @IsNotEmpty()
  @IsArray()
  phones: string[];

  @IsNotEmpty()
  @IsEnum(TTSProviderType)
  ttsType: TTSProviderType;
}
