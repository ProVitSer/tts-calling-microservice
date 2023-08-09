import { Injectable } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { QueueTypes, RabbitMqExchange } from '@app/rabbit/interfaces/rabbit.enum';
import { CallingPubSubInfo } from '../interfaces/calling.interface';
import { UtilsService } from '@app/utils/utils.service';
import { AsteriskAriACallService } from '@app/asterisk/asterisk-ari-call.service';
import { AsteriskContext, ChannelType } from '@app/asterisk/interfaces/asterisk.enum';
import { NUMBER_PREFIX, CALLING_TTS_LOCAL_CONTEXT, PLAY_BACK_PATH } from '@app/asterisk/asterisk.consts';
import { AsteriskAriOriginate } from '@app/asterisk/interfaces/asterisk.interface';
import { CallingService } from '../services/calling.service';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { TASK_STOP } from '../calling.consts';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class CallingTaskSubService {
  constructor(
    private readonly logger: LoggerService,
    private readonly ast: AsteriskAriACallService,
    private readonly callingService: CallingService,
  ) {}

  @RabbitSubscribe({
    exchange: RabbitMqExchange.presence,
    queue: QueueTypes.calling,
  })
  public async callingTaskSubHandler(msg: CallingPubSubInfo): Promise<void | Nack> {
    try {
      await this.checkTaskStatus(msg);
      await this.ast.sendAriCall(this.getOriginateInfo(msg));
      await UtilsService.sleep(30000);
    } catch (e) {
      this.logger.info(`${e}: ${JSON.stringify(msg)}`);
      return;
    }
  }

  private async checkTaskStatus(msg: CallingPubSubInfo) {
    const callingTask = await this.callingService.getTaskByApplicationId(msg.applicationId);
    if (![ApplicationApiActionStatus.inProgress].includes(callingTask.status)) {
      throw TASK_STOP;
    }
  }

  private getOriginateInfo(callInfo: CallingPubSubInfo): AsteriskAriOriginate {
    return {
      endpoint: `${ChannelType.LOCAL}/${NUMBER_PREFIX}${callInfo.phone}@${AsteriskContext.fromInternalAdditional}`,
      context: AsteriskContext.callintTTS,
      extension: CALLING_TTS_LOCAL_CONTEXT,
      variables: {
        applicationId: callInfo.applicationId,
        fileId: callInfo.fileId,
        playBack: `${PLAY_BACK_PATH}${callInfo.playBackFile}`,
        dstNumber: callInfo.phone,
      },
    };
  }
}
