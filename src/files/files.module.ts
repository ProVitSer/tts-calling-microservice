import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Files, FilesSchema } from './files.schema';
import { FilesService } from './files.service';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: Files.name, schema: FilesSchema }])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
