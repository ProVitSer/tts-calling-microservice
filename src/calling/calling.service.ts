import { Injectable } from '@nestjs/common';
import { CallingTTSDTO } from './dto/calling-tts.dto';
import { TTSService } from '@app/tts/tts.service';
import { TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { ConfigService } from '@nestjs/config';
import { UploadData } from '@app/scp/scp.interface';
import { ScpService } from '@app/scp/scp.service';

@Injectable()
export class CallingService {
  constructor(private readonly configService: ConfigService, private readonly tts: TTSService, private readonly scp: ScpService) {}

  public async setCallingTask(data: CallingTTSDTO): Promise<void> {
    try {
      const ttsData = await this.getTTSVoiceFile(data);
      await this.scp.uploadFileToServer(this.getScpUploadData(ttsData));
    } catch (e) {
      console.log(e);
    }
  }

  private async getTTSVoiceFile(data: CallingTTSDTO): Promise<TTSVoiceFileData> {
    try {
      return await this.tts.textToSpech({
        id: data.applicationId,
        ttsType: data.ttsType,
        text: data.tts,
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
}
