import { ApplicationService } from '@app/application/application.service';
import { ApplicationId } from '@app/application/interfaces/application.interface';
import { Injectable } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { TTSProviderType } from '@app/tts/interfaces/tts.enum';
import { TTSConvertVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { TTSService } from '@app/tts/services/tts.service';
import { Files } from '@app/files/files.schema';
import { ScpService } from '@app/scp/scp.service';
import { FilesService } from '@app/files/files.service';
import { ConfigService } from '@nestjs/config';
import { CallingService } from './calling.service';
import { CallingNumber } from '../calling.schema';
import { AddCallingTaskData } from '../interfaces/calling.interface';
import { CallingTaskPubService } from '../calling-mq/calling-task-pub.service';

@Injectable()
export class CallingTaskCreateService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ttsService: TTSService,
    private readonly scp: ScpService,
    private readonly filesService: FilesService,
    private readonly callingService: CallingService,
    private readonly callingTaskPubService: CallingTaskPubService,
  ) {}

  public async setCallingTaskWithTTS(data: CallingTTSTaskDTO): Promise<ApplicationId> {
    try {
      const { applicationId } = ApplicationService.getApplicationId(true);
      const ttsData = await this.getTTSVoiceFile(data.ttsType, data.tts);
      const fileInfo = await this.saveAndUploadVoiceFile({ ...data, applicationId }, ttsData);
      await this.addCallingTask({ applicationId, fileId: fileInfo._id, numbers: data.phones });
      await this.callingTaskPubService.publishCallingTaskToQueue({ ...data, applicationId }, fileInfo);

      return {
        applicationId,
      };
    } catch (e) {
      throw e;
    }
  }

  private async getTTSVoiceFile(ttsType: TTSProviderType, text: string): Promise<TTSConvertVoiceFileData> {
    try {
      return await this.ttsService.textToSpech({
        ttsType,
        text,
      });
    } catch (e) {
      throw e;
    }
  }

  private async saveAndUploadVoiceFile(
    data: CallingTTSTaskDTO & { applicationId: string },
    ttsData: TTSConvertVoiceFileData,
  ): Promise<Files & { _id: string }> {
    const fileInfo = await this.saveVoiceFileData(ttsData, data.applicationId, data.tts);
    await this.scp.uploadFileToServer({
      ...this.scp.getAsteriskScpConnectData(),
      uploadFilePath: `${ttsData.fullFilePath}${ttsData.fileName}`,
      serverFilePath: `${this.configService.get('asterisk.ttsFilePath')}${ttsData.fileName}`,
    });
    return fileInfo;
  }

  private async saveVoiceFileData(ttsData: TTSConvertVoiceFileData, applicationId: string, text: string): Promise<Files & { _id: string }> {
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
