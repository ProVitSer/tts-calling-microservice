import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TinkoffTTS } from './tinkoff';
import { TinkoffGRPCClient } from './grpc/tinkoff.grpc.client';
import { TinkoffTTSService } from './services/tinkoff.service';
import { LoggerModule } from '@app/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [TinkoffTTS, TinkoffGRPCClient, TinkoffTTSService],
  exports: [TinkoffTTS],
})
export class TinkoffModule {}
