import { Injectable } from '@nestjs/common';
import { TTSData, TTSFile, TTSVoiceFileData } from './interfaces/tts.interface';
import { TTSProviderService } from './tts.provider';
import { FilesService } from '@app/files/files.service';
import { Files } from '@app/files/files.schema';
import { FileUtilsService } from '@app/files/files-utils';
import { TTS_FILE_NOT_FOUND } from './tts.consts';

@Injectable()
export class TTSService {
  constructor(private readonly ttsProvider: TTSProviderService, private readonly filesService: FilesService) {}

  public async textToSpech(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      return await this.ttsProvider.sendTextToTTS(data);
    } catch (e) {
      throw e;
    }
  }

  public async convertTextToVoiceFile(data: TTSData): Promise<TTSFile> {
    try {
      const voiceFile = await this.ttsProvider.sendTextToTTS(data);
      const file = await this.saveVoiceFileData(voiceFile);
      return {
        fileId: file._id,
      };
    } catch (e) {
      throw e;
    }
  }

  public async getTTSVoiceFile(fileId: string): Promise<Files> {
    try {
      const file = await this.filesService.getFileById(fileId);
      if (file == null) {
        throw 'Файл с таким id отсутствует';
      }
      if (!(await FileUtilsService.exists(FileUtilsService.getFullFilePath(file)))) {
        throw TTS_FILE_NOT_FOUND;
      }
      return file;
    } catch (e) {
      throw e;
    }
  }

  private async saveVoiceFileData(ttsData: TTSVoiceFileData) {
    return await this.filesService.saveFile({ ...ttsData });
  }
}
