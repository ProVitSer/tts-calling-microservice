import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/logger/logger.module';
import { YandexIAMTokenService } from './services/yandex.iam.token.service';
import { YandexTTS } from './yandex';
import { HttpModule } from '@nestjs/axios';
import { YandexService } from './services/yandex.service';
import { YandexHttService } from './services/yandex.http.service';

@Module({
  imports: [ConfigModule, LoggerModule, HttpModule],
  providers: [YandexTTS, YandexIAMTokenService, YandexService, YandexHttService],
  exports: [YandexTTS],
})
export class YandexModule {}
