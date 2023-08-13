import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/logger/logger.module';
import { SberTTS } from './sber';
import { HttpModule } from '@nestjs/axios';
import { SberService } from './services/sber.service';
import { SberTokenService } from './services/sber.token.service';
import { SberGRPCClient } from './grpc/sber.grpc.client';

@Module({
  imports: [ConfigModule, LoggerModule, HttpModule],
  providers: [SberTTS, SberService, SberTokenService, SberGRPCClient],
  exports: [SberTTS],
})
export class SberModule {}
