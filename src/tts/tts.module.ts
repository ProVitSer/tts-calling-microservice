import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TTSProviderService } from './tts.provider';
import { TTSService } from './services/tts.service';
import { YandexTTS } from './providers/yandex/yandex';
import { YandexIAMToken } from './providers/yandex/yandex-iam-token';
import { HttpModule } from '@nestjs/axios';
import { TTSController } from './controllers/tts.controller';
import { FilesModule } from '@app/files/files.module';
import { LoggerModule } from '@app/logger/logger.module';
import { TinkoffModule } from './providers/tinkoff/tinkoff.module';

@Module({
  imports: [ConfigModule, LoggerModule, HttpModule, FilesModule, TinkoffModule],
  providers: [TTSProviderService, TTSService, YandexTTS, YandexIAMToken],
  exports: [TTSService],
  controllers: [TTSController],
})
export class TTSModule {}
