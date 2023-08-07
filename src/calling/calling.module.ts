import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallingController } from './controllers/calling.controller';
import { TTSModule } from '@app/tts/tts.module';
import { ScpModule } from '@app/scp/scp.module';
import { FilesModule } from '@app/files/files.module';
import { RabbitModule } from '@app/rabbit/rabbit.module';
import { AsteriskModule } from '@app/asterisk/asterisk.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Calling, CallingSchema } from './calling.schema';
import { LoggerModule } from '@app/logger/logger.module';
import { CallingTaskCreateService } from './services/calling-task-create.service';
import { CallingService } from './services/calling.service';
import { CallingTaskPubService } from './calling-mq/calling-task-pub.service';
import { CallingTaskResultService } from './services/calling-task-result.service';
import { CallingModifyTaskService } from './services/calling-task-modify.service';
import { CallingTaskSubService } from './calling-mq/calling-task-sub.service';
import { CallingTaskService } from './services/calling-task.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: Calling.name, schema: CallingSchema }]),
    TTSModule,
    ScpModule,
    FilesModule,
    RabbitModule,
    AsteriskModule,
  ],
  providers: [
    CallingService,
    CallingTaskService,
    CallingTaskCreateService,
    CallingTaskResultService,
    CallingTaskPubService,
    CallingTaskSubService,
    CallingModifyTaskService,
  ],
  exports: [],
  controllers: [CallingController],
})
export class CallingModule {}
