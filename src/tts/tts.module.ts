import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TTSProviderService } from './tts.provider';
import { TTSService } from './services/tts.service';
import { TTSController } from './controllers/tts.controller';
import { FilesModule } from '@app/files/files.module';
import { LoggerModule } from '@app/logger/logger.module';
import { TinkoffModule } from './providers/tinkoff/tinkoff.module';
import { YandexModule } from './providers/yandex/yandex.module';
import { TTSConvertService } from './services/tts.convert.service';
import { SberModule } from './providers/sber/sber.module';

@Module({
  imports: [ConfigModule, LoggerModule, FilesModule, TinkoffModule, YandexModule, SberModule],
  providers: [TTSProviderService, TTSService, TTSConvertService],
  exports: [TTSService],
  controllers: [TTSController],
})
export class TTSModule {}
