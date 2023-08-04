import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CallingTTSDTO {
  @IsString()
  @IsNotEmpty()
  tts: string;

  @IsNotEmpty()
  @IsArray()
  phones: string[];

  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @IsNotEmpty()
  @IsEnum(TTSProviderType)
  ttsType: TTSProviderType;
}
