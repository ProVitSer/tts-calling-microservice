import { Injectable } from '@nestjs/common';
import { CallingTTSTaskDTO } from './dto/calling-tts-task.dto';
import { TTSService } from '@app/tts/tts.service';
import { TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { ConfigService } from '@nestjs/config';
import { UploadData } from '@app/scp/scp.interface';
import { ScpService } from '@app/scp/scp.service';
import { FilesService } from '@app/files/files.service';
import { Files } from '@app/files/files.schema';
import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { RabbitPubService } from '@app/rabbit/rabbit.service';
import { RabbitMqExchange, RoutingKey } from '@app/rabbit/interfaces/rabbit.enum';
import { CallingPubSubInfo } from './calling.interface';
import { AsteriskAriACallService } from '@app/asterisk/asterisk-ari-call.service';
import { AsteriskAriOriginate } from '@app/asterisk/asterisk.interface';

@Injectable()
export class CallingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ttsService: TTSService,
    private readonly scp: ScpService,
    private readonly filesService: FilesService,
    private readonly rabbitPubService: RabbitPubService,
    private readonly ast: AsteriskAriACallService,
  ) {}

  public async setCallingTaskWithTTS(data: CallingTTSTaskDTO): Promise<void> {
    try {
      const ttsData = await this.getTTSVoiceFile(data.ttsType, data.tts);
      const fileInfo = await this.saveVoiceFileData(ttsData, data);
      await this.scp.uploadFileToServer(this.getScpConnectData(ttsData));
      await this.addCallingTaskToQueue(data, fileInfo);
    } catch (e) {
      throw e;
    }
  }

  public async sendCallToAsterisk(callInfo: CallingPubSubInfo) {
    await this.ast.sendAriCall(this.getOrigonateInfo(callInfo));
  }

  private getOrigonateInfo(callInfo: CallingPubSubInfo): AsteriskAriOriginate {
    return {
      endpoint: `PJSIP/${callInfo.phone}@XXXXXX`,
      callerId: 'XXXXXX',
      context: 'tts',
      extension: '2222',
      variables: {
        playBack: `custom/tts/${callInfo.playBackFile}`,
      },
    };
  }

  private async addCallingTaskToQueue(data: CallingTTSTaskDTO, fileInfo: Files & { _id: string }): Promise<void> {
    try {
      await Promise.all(
        data.phones.map(async (phone: string) => {
          await this._addCallingTaskToQueue({
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
    return {
      host: this.configService.get('asterisk.ssh.host'),
      port: this.configService.get('asterisk.ssh.port'),
      username: this.configService.get('asterisk.ssh.username'),
      password: this.configService.get('asterisk.ssh.password'),
      uploadFilePath: `${ttsData.fullFilePath}${ttsData.fileName}`,
      serverFilePath: `${this.configService.get('asterisk.ttsFilePath')}${ttsData.fileName}`,
    };
  }

  private async saveVoiceFileData(ttsData: TTSVoiceFileData, data: CallingTTSTaskDTO): Promise<Files & { _id: string }> {
    return await this.filesService.saveFile({ ...ttsData, applicationId: data.applicationId });
  }
}
