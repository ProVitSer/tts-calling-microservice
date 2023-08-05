import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallingController } from './calling.controller';
import { CallingService } from './calling.service';
import { TTSModule } from '@app/tts/tts.module';
import { ScpModule } from '@app/scp/scp.module';
import { FilesModule } from '@app/files/files.module';

@Module({
  imports: [ConfigModule, TTSModule, ScpModule, FilesModule],
  providers: [CallingService],
  exports: [],
  controllers: [CallingController],
})
export class CallingModule {}
