import { Injectable } from '@nestjs/common';
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
import { CallingNumber } from '../calling.schema';

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
      await this.addCallingTaskToQueue({ ...data, applicationId }, fileInfo);
      await this.addCallingTask({ applicationId, fileId: fileInfo._id, numbers: data.phones });
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

  private async saveAndUploadVoiceFile(data: CallingTTSData, ttsData: TTSVoiceFileData): Promise<Files & { _id: string }> {
    const fileInfo = await this.saveVoiceFileData(ttsData, data);
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
      await Promise.all(
        data.phones.map(async (phone: string) => {
          await this._addCallingTaskToQueue({
            applicationId: data.applicationId,
            fileId: fileInfo._id,
            phone,
            playBackFile: fileInfo.generatedFileName,
          });
        }),
      );
    } catch (e) {
      throw e;
    }
  }

  private async _addCallingTaskToQueue(message: CallingPubSubInfo): Promise<void> {
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

  private async saveVoiceFileData(ttsData: TTSVoiceFileData, data: CallingTTSData): Promise<Files & { _id: string }> {
    return await this.filesService.saveFile({ ...ttsData, text: data.tts, applicationId: data.applicationId });
  }

  private async addCallingTask({ applicationId, fileId, numbers }: AddCallingTaskData) {
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
