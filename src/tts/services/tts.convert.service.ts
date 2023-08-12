import { Injectable } from '@nestjs/common';
import { TTSProviderVoiceFileData, TTSConvertVoiceFileData } from '../interfaces/tts.interface';
import { TTSProviderType, VoiceFileFormat } from '../interfaces/tts.enum';
import { FileUtilsService } from '@app/utils/files.utils';
import { exec, ExecException } from 'child_process';

@Injectable()
export class TTSConvertService {
  public async convertTTSVoiceFileToWav(ttsType: TTSProviderType, data: TTSProviderVoiceFileData): Promise<TTSConvertVoiceFileData> {
    try {
      const wavFileName = await this._convertTTSVoiceFileToWav(data);
      return {
        fileName: wavFileName,
        generatedFileName: data.generatedFileName,
        fullFilePath: data.fullFilePath,
        format: VoiceFileFormat.wav,
      };
    } catch (e) {
      throw e;
    }
  }

  private async _convertTTSVoiceFileToWav(data: TTSProviderVoiceFileData): Promise<string> {
    try {
      const wavFileName = `${data.generatedFileName}.${VoiceFileFormat.wav}`;
      const fullFileName = `${data.fullFilePath}${wavFileName}`;
      await new Promise((resolve, reject) => {
        exec(
          `sox -r ${data.sampleRateHertz} -b 16 -e signed-integer -c 1 ${FileUtilsService.getFullFilePath(data)} ${fullFileName}`,
          (error: ExecException, stdout, stderr: string) => {
            if (error || stderr) {
              reject(error);
            }
            resolve(true);
          },
        );
      });
      return wavFileName;
    } catch (e) {
      throw e;
    }
  }
}
