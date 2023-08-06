import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TTSProviderService } from './tts.provider';
import { TTSService } from './services/tts.service';
import { YandexTTS } from './providers/yandex/yandex';
import { TinkoffTTS } from './providers/tinkoff/tinkoff';
import { YandexIAMToken } from './providers/yandex/yandex-iam-token';
import { HttpModule } from '@nestjs/axios';
import { TTSController } from './controllers/tts.controller';
import { FilesModule } from '@app/files/files.module';

@Module({
  imports: [ConfigModule, HttpModule, FilesModule],
  providers: [TTSProviderService, TTSService, YandexTTS, YandexIAMToken, TinkoffTTS],
  exports: [TTSService],
  controllers: [TTSController],
})
export class TTSModule {}
