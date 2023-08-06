import { Injectable } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { QueueTypes, RabbitMqExchange } from '@app/rabbit/interfaces/rabbit.enum';
import { CallingPubSubInfo } from '../interfaces/calling.interface';
import { UtilsService } from '@app/utils/utils.service';
import { CallingTaskService } from '../services/calling-task.service';

@Injectable()
export class CallingSubService {
  constructor(private readonly callingTaskService: CallingTaskService) {}
  @RabbitSubscribe({
    exchange: RabbitMqExchange.presence,
    queue: QueueTypes.calling,
  })
  public async pubSubHandler(msg: CallingPubSubInfo): Promise<void | Nack> {
    try {
      await this.callingTaskService.sendCallToAsterisk(msg);
      await UtilsService.sleep(30000);
    } catch (e) {
      return new Nack(true);
    }
  }
}
