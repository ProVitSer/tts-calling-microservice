import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TTSDTO {
  @IsString()
  @IsNotEmpty()
  tts: string;

  @IsNotEmpty()
  @IsEnum(TTSProviderType)
  ttsType: TTSProviderType;
}
