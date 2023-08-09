import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CallingTasIdkDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор обзвона', example: '911e4ef8-aded-4a1d-86e9-9b8c6b8e10e0' })
  applicationId: string;
}
