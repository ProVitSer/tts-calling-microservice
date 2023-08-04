import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/config.provider';
import { AsteriskModule } from './asterisk/asterisk.module';
import { CallingModule } from './calling/calling.module';
import { TTSModule } from './tts/tts.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), AsteriskModule, CallingModule, TTSModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
