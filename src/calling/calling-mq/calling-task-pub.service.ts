import { RabbitPubService } from '@app/rabbit/rabbit.service';
import { Injectable } from '@nestjs/common';
import { CallingPubSubInfo, CallingTTSData } from '../interfaces/calling.interface';
import { Files } from '@app/files/files.schema';
import { RabbitMqExchange, RoutingKey } from '@app/rabbit/interfaces/rabbit.enum';

@Injectable()
export class CallingTaskPubService {
  constructor(private readonly rabbitPubService: RabbitPubService) {}

  public async publishCallingTaskToQueue(data: CallingTTSData, fileInfo: Files & { _id: string }): Promise<void> {
    try {
      for (const phone of data.phones) {
        await this._publishCallingTaskToQueue({
          applicationId: data.applicationId,
          fileId: fileInfo._id.toString(),
          phone,
          playBackFile: fileInfo.generatedFileName,
        });
      }
    } catch (e) {
      throw e;
    }
  }

  private async _publishCallingTaskToQueue(message: CallingPubSubInfo): Promise<void> {
    await this.rabbitPubService.sendMessage(RabbitMqExchange.presence, RoutingKey.tts, message);
  }
}
