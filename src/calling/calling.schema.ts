import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { AsteriskDialStatus } from '@app/asterisk/interfaces/asterisk.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CallingDocument = Calling & Document;

@Schema({ collection: 'calling' })
export class Calling {
  @Prop({ unique: true })
  applicationId: string;

  @Prop({ unique: true })
  fileId: string;

  @Prop({
    type: String,
    enum: ApplicationApiActionStatus,
    default: ApplicationApiActionStatus.inProgress,
  })
  status?: ApplicationApiActionStatus;

  @Prop()
  numbers: CallingNumber[];

  @Prop()
  deleted?: boolean;

  @Prop({ type: Date, default: Date.now })
  created?: Date;

  @Prop({ type: Date, default: Date.now })
  changed?: Date;
}

@Schema()
export class CallingNumber {
  @Prop()
  dstNumber: string;

  @Prop()
  callerId?: string;

  @Prop({ unique: true })
  uniqueid?: string;

  @Prop({
    type: String,
    enum: AsteriskDialStatus,
  })
  dialStatus?: string;

  @Prop()
  fileId?: string;

  @Prop()
  callDate?: string;
}

const CallingSchema = SchemaFactory.createForClass(Calling);

CallingSchema.index({ uniqueid: 'text' });

export { CallingSchema };
