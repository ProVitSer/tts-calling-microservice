import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { AsteriskDialStatus } from '@app/asterisk/interfaces/asterisk.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CallingDocument = Calling & Document;

@Schema()
export class CallingNumber {
  @Prop()
  @ApiProperty({
    description: 'Номера абонента',
    example: '74951234567',
    required: true,
  })
  dstNumber: string;

  @Prop()
  @ApiProperty({
    description: 'Исходящий callerId(номер который отобразиться у абонента)',
    example: '79031234567',
    required: false,
  })
  callerId?: string;

  @Prop({ unique: true })
  @ApiProperty({
    description: 'Уникальный идентификатор из Asterisk',
    example: 'a58afc7f-4d7b-4744-9edc-9129e8f74111',
    required: false,
  })
  uniqueid?: string;

  @Prop({
    type: String,
    enum: AsteriskDialStatus,
  })
  @ApiProperty({
    enum: AsteriskDialStatus,
    enumName: 'AsteriskDialStatus',
    description: 'Результат дозвона до абонента',
    required: false,
  })
  dialStatus?: AsteriskDialStatus;

  @Prop()
  @ApiProperty({
    description: 'id голосового файла который проигрался абоненту',
    example: '64d21e2f6837233d77a11641',
    required: false,
  })
  fileId?: string;

  @Prop()
  @ApiProperty({
    description: 'Время завершения звонка абоненту',
    example: '2023-08-07T18:10:48.777Z',
    required: false,
  })
  callDate?: string;
}

@Schema({ collection: 'calling' })
export class Calling {
  @Prop({ unique: true })
  @ApiProperty({
    description: 'Уникальный идентификатор задачи',
    example: '19760f74-a50a-4248-8fc1-44a6aa879b60',
  })
  applicationId: string;

  @Prop({ unique: true })
  @ApiProperty({
    description: 'Преобразованный через tts голосовой файл который будет озвучиваться абонентам при обзвоне',
    example: '64d21e2f6837233d77a11641',
  })
  fileId: string;

  @Prop({
    type: String,
    enum: ApplicationApiActionStatus,
    default: ApplicationApiActionStatus.inProgress,
  })
  @ApiProperty({
    enum: ApplicationApiActionStatus,
    enumName: 'ApplicationApiActionStatus',
    description: 'Актуальный статус выполнения задачи на обзвон',
  })
  status?: ApplicationApiActionStatus;

  @Prop()
  @ApiProperty({
    type: [CallingNumber],
    description: 'Результат обзвона по номерам',
  })
  numbers: CallingNumber[];

  @Prop()
  deleted?: boolean;

  @Prop({ type: Date, default: Date.now })
  created?: Date;

  @Prop({ type: Date, default: Date.now })
  changed?: Date;
}

const CallingSchema = SchemaFactory.createForClass(Calling);

CallingSchema.index({ uniqueid: 'text' });

export { CallingSchema };
