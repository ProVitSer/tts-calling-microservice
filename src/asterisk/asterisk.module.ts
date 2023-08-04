import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as ARI from 'ari-client';
import { AsteriskAriACallService } from './asterisk-ari-call.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ARI',
      useFactory: async (configService: ConfigService) => {
        return {
          ariClient: await ARI.connect(
            configService.get('asterisk.ari.url'),
            configService.get('asterisk.ari.user'),
            configService.get('asterisk.ari.password'),
          ),
        };
      },
      inject: [ConfigService],
    },
    AsteriskAriACallService,
  ],
  exports: ['ARI', AsteriskAriACallService],
})
export class AsteriskModule {}
