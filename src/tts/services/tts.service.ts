import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TTSData, TTSFile, TTSVoiceFileData } from '../interfaces/tts.interface';
import { TTSProviderService } from '../tts.provider';
import { FilesService } from '@app/files/files.service';
import { Files } from '@app/files/files.schema';
import { FileUtilsService } from '@app/utils/files-utils';
import { CONVERT_FILE_ERROR, TTS_FILE_NOT_FOUND } from '../tts.consts';
import { LoggerService } from '@app/logger/logger.service';
import TTSFileNotFoundException from '../exceptions/tts-file-not-found.exception';

@Injectable()
export class TTSService {
  constructor(
    private readonly ttsProvider: TTSProviderService,
    private readonly logger: LoggerService,
    private readonly filesService: FilesService,
  ) {}

  public async textToSpech(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      return await this.ttsProvider.sendTextToTTS(data);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(CONVERT_FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async convertTextToVoiceFile(data: TTSData): Promise<TTSFile> {
    try {
      const voiceFile = await this.ttsProvider.sendTextToTTS(data);
      const file = await this.saveVoiceFileData(voiceFile, data.text);
      return {
        fileId: file._id,
      };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(CONVERT_FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTTSVoiceFile(fileId: string): Promise<Files> {
    try {
      const file = await this.filesService.getFileById(fileId);
      if (file == null) {
        throw new TTSFileNotFoundException(fileId);
      }
      if (!(await FileUtilsService.exists(FileUtilsService.getFullFilePath(file)))) {
        throw new TTSFileNotFoundException(fileId, TTS_FILE_NOT_FOUND);
      }
      return file;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async saveVoiceFileData(ttsData: TTSVoiceFileData, text: string) {
    return await this.filesService.saveFile({ ...ttsData, text });
  }
}
