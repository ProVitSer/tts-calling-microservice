import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilesDocument = Files & Document;

@Schema({ collection: 'files' })
export class Files {
  @Prop()
  applicationId?: string;

  @Prop()
  fileName: string;

  @Prop()
  generatedFileName: string;

  @Prop()
  fullFilePath: string;

  @Prop()
  text?: string;

  @Prop()
  deleted?: boolean;

  @Prop({ type: Date, default: Date.now })
  created?: Date;

  @Prop({ type: Date, default: Date.now })
  changed?: Date;
}

const FilesSchema = SchemaFactory.createForClass(Files);

FilesSchema.index({ uniqueid: 'text' });

export { FilesSchema };
