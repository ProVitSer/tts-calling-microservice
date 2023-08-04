import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TTSProviderService } from './tts.provider';
import { TTSService } from './tts.service';
import { YandexTTS } from './providers/yandex/yandex';
import { TinkoffTTS } from './providers/tinkoff/tinkoff';
import { YandexIAMToken } from './providers/yandex/yandex-iam-token';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [TTSProviderService, TTSService, YandexTTS, YandexIAMToken, TinkoffTTS],
  exports: [TTSService],
  controllers: [],
})
export class TTSModule {}
