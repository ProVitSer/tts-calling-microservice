import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScpService } from './scp.service';

@Module({
  imports: [ConfigModule],
  providers: [ScpService],
  exports: [ScpService],
})
export class ScpModule {}
