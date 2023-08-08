import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TTSDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Текст который надо озвучить', example: 'Обзвон для информирования' })
  tts: string;

  @IsNotEmpty()
  @IsEnum(TTSProviderType)
  @ApiProperty({
    enum: TTSProviderType,
    enumName: 'TTSProviderType',
    description: 'Провайдер озвучки, пока реализован только yandex',
  })
  ttsType: TTSProviderType;
}
