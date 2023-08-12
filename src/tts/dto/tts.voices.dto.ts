import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class TTSVoicesDTO {
  @IsNotEmpty()
  @IsEnum(TTSProviderType)
  @ApiProperty({
    enum: TTSProviderType,
    enumName: 'TTSProviderType',
    description: 'Провайдер озвучки',
  })
  ttsType: TTSProviderType;
}
