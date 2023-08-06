import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallingController } from './controllers/calling.controller';
import { TTSModule } from '@app/tts/tts.module';
import { ScpModule } from '@app/scp/scp.module';
import { FilesModule } from '@app/files/files.module';
import { CallingSubService } from './calling-sub/calling-sub.service';
import { RabbitModule } from '@app/rabbit/rabbit.module';
import { AsteriskModule } from '@app/asterisk/asterisk.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Calling, CallingSchema } from './calling.schema';
import { CallingTaskService } from './services/calling-task.service';
import { CallingService } from './services/calling.service';
import { CallingTaskResultService } from './services/calling-task-result.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Calling.name, schema: CallingSchema }]),
    TTSModule,
    ScpModule,
    FilesModule,
    RabbitModule,
    AsteriskModule,
  ],
  providers: [CallingTaskService, CallingSubService, CallingService, CallingTaskResultService],
  exports: [],
  controllers: [CallingController],
})
export class CallingModule {}
