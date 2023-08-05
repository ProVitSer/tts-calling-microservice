import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallingController } from './calling.controller';
import { CallingService } from './calling.service';
import { TTSModule } from '@app/tts/tts.module';
import { ScpModule } from '@app/scp/scp.module';
import { FilesModule } from '@app/files/files.module';
import { CallingSubService } from './calling-sub/calling-sub.service';
import { RabbitModule } from '@app/rabbit/rabbit.module';
import { AsteriskModule } from '@app/asterisk/asterisk.module';

@Module({
  imports: [ConfigModule, TTSModule, ScpModule, FilesModule, RabbitModule, AsteriskModule],
  providers: [CallingService, CallingSubService],
  exports: [],
  controllers: [CallingController],
})
export class CallingModule {}
