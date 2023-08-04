import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallingController } from './calling.controller';
import { CallingService } from './calling.service';
import { TTSModule } from '@app/tts/tts.module';

@Module({
  imports: [ConfigModule, TTSModule],
  providers: [CallingService],
  exports: [],
  controllers: [CallingController],
})
export class CallingModule {}
