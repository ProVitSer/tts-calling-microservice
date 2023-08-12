import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidObjectId } from '../validator/objectId.validator';

export class CallingTaskUpdateVoiceFileDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор обзвона', example: '911e4ef8-aded-4a1d-86e9-9b8c6b8e10e0' })
  applicationId: string;

  @IsString()
  @IsNotEmpty()
  @IsValidObjectId({ each: true })
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор преобразованного tts файла', example: '64d21e2f6837233d77a11640' })
  fileId: string;
}
