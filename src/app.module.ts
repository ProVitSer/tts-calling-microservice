import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/config.provider';
import { AsteriskModule } from './asterisk/asterisk.module';
import { CallingModule } from './calling/calling.module';
import { TTSModule } from './tts/tts.module';
import { ScpModule } from './scp/scp.module';
import { FilesModule } from './files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoUseFactory } from './config/mongo.config';
import { RabbitModule } from './rabbit/rabbit.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMongoUseFactory,
      inject: [ConfigService],
    }),
    AsteriskModule,
    CallingModule,
    TTSModule,
    ScpModule,
    FilesModule,
    RabbitModule,
  ],
  controllers: [],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
