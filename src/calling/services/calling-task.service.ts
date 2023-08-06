import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { TTSService } from '@app/tts/services/tts.service';
import { TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { ConfigService } from '@nestjs/config';
import { UploadData } from '@app/scp/scp.interface';
import { ScpService } from '@app/scp/scp.service';
import { FilesService } from '@app/files/files.service';
import { Files } from '@app/files/files.schema';
import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { RabbitPubService } from '@app/rabbit/rabbit.service';
import { RabbitMqExchange, RoutingKey } from '@app/rabbit/interfaces/rabbit.enum';
import { AddCallingTaskData, CallingPubSubInfo, CallingTTSData } from '../interfaces/calling.interface';
import { AsteriskAriACallService } from '@app/asterisk/asterisk-ari-call.service';
import { AsteriskAriOriginate } from '@app/asterisk/interfaces/asterisk.interface';
import { CALLING_TTS_LOCAL_CONTEXT, NUMBER_PREFIX, PLAY_BACK_PATH } from '@app/asterisk/asterisk.consts';
import { AsteriskContext, ChannelType } from '@app/asterisk/interfaces/asterisk.enum';
import { ApplicationService } from '@app/application/application.service';
import { ApplicationId } from '@app/application/interfaces/application.interface';
import { CallingService } from './calling.service';
import { Calling, CallingNumber } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { NOT_CALLED_NUMBER_IN_TASK, TASK_IS_CANCEL, TASK_NOT_FOUND, TASK_STOP } from '../calling.consts';

@Injectable()
export class CallingTaskService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ttsService: TTSService,
    private readonly scp: ScpService,
    private readonly filesService: FilesService,
    private readonly rabbitPubService: RabbitPubService,
    private readonly ast: AsteriskAriACallService,
    private readonly callingService: CallingService,
  ) {}

  public async setCallingTaskWithTTS(data: CallingTTSTaskDTO): Promise<ApplicationId> {
    try {
      const { applicationId } = ApplicationService.getApplicationId(true);
      const ttsData = await this.getTTSVoiceFile(data.ttsType, data.tts);
      const fileInfo = await this.saveAndUploadVoiceFile({ ...data, applicationId }, ttsData);
      await this.addCallingTask({ applicationId, fileId: fileInfo._id, numbers: data.phones });
      await this.addCallingTaskToQueue({ ...data, applicationId }, fileInfo);

      return {
        applicationId,
      };
    } catch (e) {
      throw e;
    }
  }

  public async sendCallToAsterisk(callInfo: CallingPubSubInfo) {
    await this.ast.sendAriCall(this.getOriginateInfo(callInfo));
  }

  public async checkTaskStatus(data: CallingPubSubInfo) {
    try {
      const callingTask = await this.callingService.getTaskByApplicationId(data.applicationId);
      if (![ApplicationApiActionStatus.inProgress].includes(callingTask.status)) {
        throw TASK_STOP;
      }
    } catch (e) {
      throw e;
    }
  }

  public async updateTaskStatus(applicationId: string, status: ApplicationApiActionStatus) {
    try {
      if (!(await this.callingService.isTaskExist(applicationId))) {
        throw new HttpException(`${TASK_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }
      if (await this.callingService.isTaskCancel(applicationId)) {
        throw new HttpException(`${TASK_IS_CANCEL}`, HttpStatus.FORBIDDEN);
      }

      await this.callingService.update({ applicationId }, { status });
      return;
    } catch (e) {
      throw e;
    }
  }

  public async continueTask(applicationId: string) {
    try {
      if (!(await this.callingService.isTaskExist(applicationId))) {
        throw new HttpException(`${TASK_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }

      const task = await this.callingService.getTaskByApplicationId(applicationId);
      if (task.status == ApplicationApiActionStatus.cancel) {
        throw new HttpException(`${TASK_IS_CANCEL}`, HttpStatus.FORBIDDEN);
      }

      const file = await this.filesService.getFileById(task.fileId);
      await this.callingService.update({ applicationId }, { status: ApplicationApiActionStatus.inProgress });

      await this.addCallingTaskToQueue({ phones: this.getNotCalledNumbers(task), applicationId }, file);
    } catch (e) {
      throw e;
    }
  }

  private getNotCalledNumbers(task: Calling): string[] {
    const notCalledNumber = task.numbers
      .map((number: CallingNumber) => {
        if (!number.hasOwnProperty('callerId')) {
          return number.dstNumber;
        }
      })
      .filter((n) => n !== undefined);
    if (notCalledNumber.length == 0) throw NOT_CALLED_NUMBER_IN_TASK;
    return notCalledNumber;
  }

  private async saveAndUploadVoiceFile(
    data: CallingTTSTaskDTO & { applicationId: string },
    ttsData: TTSVoiceFileData,
  ): Promise<Files & { _id: string }> {
    const fileInfo = await this.saveVoiceFileData(ttsData, data.applicationId, data.tts);
    await this.scp.uploadFileToServer(this.getScpConnectData(ttsData));
    return fileInfo;
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

  private async addCallingTaskToQueue(data: CallingTTSData, fileInfo: Files & { _id: string }): Promise<void> {
    try {
      for (const phone of data.phones) {
        await this._addCallingTaskToQueue({
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

  private async _addCallingTaskToQueue(message: CallingPubSubInfo): Promise<void> {
    console.log(message);
    await this.rabbitPubService.sendMessage(RabbitMqExchange.presence, RoutingKey.tts, message);
  }

  private async getTTSVoiceFile(ttsType: TTSProviderType, text: string): Promise<TTSVoiceFileData> {
    try {
      return await this.ttsService.textToSpech({
        ttsType,
        text,
      });
    } catch (e) {
      throw e;
    }
  }

  private getScpConnectData(ttsData: TTSVoiceFileData): UploadData {
    const { host, port, username, password } = this.configService.get('asterisk.ssh');
    return {
      host,
      port,
      username,
      password,
      uploadFilePath: `${ttsData.fullFilePath}${ttsData.fileName}`,
      serverFilePath: `${this.configService.get('asterisk.ttsFilePath')}${ttsData.fileName}`,
    };
  }

  private async saveVoiceFileData(ttsData: TTSVoiceFileData, applicationId: string, text: string): Promise<Files & { _id: string }> {
    return await this.filesService.saveFile({ ...ttsData, text, applicationId });
  }

  private async addCallingTask({ applicationId, fileId, numbers }: AddCallingTaskData): Promise<void> {
    try {
      await this.callingService.saveCallingTask({
        applicationId,
        fileId,
        numbers: numbers.map((n: string) => {
          return {
            dstNumber: n,
          } as CallingNumber;
        }),
      });
    } catch (e) {
      throw e;
    }
  }
}
