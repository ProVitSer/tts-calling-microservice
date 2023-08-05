import { Injectable } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { QueueTypes, RabbitMqExchange } from '@app/rabbit/interfaces/rabbit.enum';
import { CallingPubSubInfo } from '../calling.interface';
import { CallingService } from '../calling.service';

@Injectable()
export class CallingSubService {
  constructor(private readonly callingService: CallingService) {}

  @RabbitSubscribe({
    exchange: RabbitMqExchange.presence,
    queue: QueueTypes.calling,
  })
  public async pubSubHandler(msg: CallingPubSubInfo): Promise<void | Nack> {
    try {
      console.log(msg);
      await this.callingService.sendCallToAsterisk(msg);
    } catch (e) {
      return new Nack(true);
    }
  }
}
