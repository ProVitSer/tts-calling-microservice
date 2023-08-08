import { ApiProperty } from '@nestjs/swagger';

export class ApplicationId {
  @ApiProperty({ type: 'string', description: 'Уникальный идентификатор обзвона', example: '19760f74-a50a-4248-8fc1-44a6aa879b60' })
  applicationId: string;
}
