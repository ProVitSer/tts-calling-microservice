import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IsValidPhoneArray } from '../validator/phones.validator';

export class CallingTTSTaskDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Текст который надо озвучить', example: 'Обзвон для информирования' })
  tts: string;

  @IsNotEmpty()
  @IsArray()
  @IsValidPhoneArray()
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

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Голос которым будет озвучен текст. Если парамертр не передан, выставляется default голос для данного провайдера озвучки',
    example: 'alena',
  })
  voice?: string;

  @IsString()
  @ValidateIf((o) => o.voice !== undefined)
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: false,
    description:
      'Эмоция с которой будет озвучен текст. Если парамертр не передан, выставляется default эмоция для данного провайдера озвучки',
    example: 'good',
  })
  emotion?: string;
}
