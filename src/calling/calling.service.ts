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

@Injectable()
export class CallingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ttsService: TTSService,
    private readonly scp: ScpService,
    private readonly filesService: FilesService,
  ) {}

  public async setCallingTaskWithTTS(data: CallingTTSTaskDTO): Promise<void> {
    try {
      const ttsData = await this.getTTSVoiceFile(data.ttsType, data.tts);
      await this.saveVoiceFileData(ttsData, data);
      await this.scp.uploadFileToServer(this.getScpUploadData(ttsData));
    } catch (e) {
      throw e;
    }
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

  private getScpUploadData(ttsData: TTSVoiceFileData): UploadData {
    return {
      host: this.configService.get('asterisk.ssh.host'),
      port: this.configService.get('asterisk.ssh.port'),
      username: this.configService.get('asterisk.ssh.username'),
      password: this.configService.get('asterisk.ssh.password'),
      uploadFilePath: `${ttsData.fullFilePath}${ttsData.fileName}`,
      serverFilePath: `${this.configService.get('asterisk.ttsFilePath')}${ttsData.fileName}`,
    };
  }

  private async saveVoiceFileData(ttsData: TTSVoiceFileData, data: CallingTTSTaskDTO): Promise<Files> {
    return await this.filesService.saveFile({ ...ttsData, applicationId: data.applicationId });
  }
}
