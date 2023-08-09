import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CallingTTSTaskDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Текст который надо озвучить', example: 'Обзвон для информирования' })
  tts: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String], description: 'Номера в формате E164', example: ['74951234567', '79101234567'] })
  phones: string[];

  @IsNotEmpty()
  @IsEnum(TTSProviderType)
  @ApiProperty({
    enum: TTSProviderType,
    enumName: 'TTSProviderType',
    description: 'Провайдер озвучки, пока реализован только yandex',
  })
  ttsType: TTSProviderType;
}
