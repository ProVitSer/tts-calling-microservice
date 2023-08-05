import { TTSData, TTSProvider, TTSVoiceFileData } from '@app/tts/interfaces/tts.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { YandexDataAdapter } from './yandex.adapter';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { YandexIAMToken } from './yandex-iam-token';
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { YandexSpeech } from './interfaces/interface';
import { firstValueFrom, catchError } from 'rxjs';
import * as uuid from 'uuid';
import { FileUtilsService } from '@app/files/files-utils';
import { VoiceFileFormat } from '@app/tts/interfaces/tts.enum';

@Injectable()
export class YandexTTS implements TTSProvider {
  private readonly axios: AxiosInstance;
  private readonly iam: YandexIAMToken;
  private readonly voicePath: string;
  private readonly format: VoiceFileFormat = VoiceFileFormat.raw;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly iamToken: YandexIAMToken,
  ) {
    this.voicePath = this.configService.get('voiceFileDir');
    this.axios = this.httpService.axiosRef;
    this.iam = this.iamToken;
    this.httpService.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async function (error: AxiosError) {
        const originalRequest = error.config;

        try {
          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            const iamToken = await this.iam.refreshIAMToken();
            originalRequest.headers['Authorization'] = `Bearer ${iamToken}`;
            return this.axios.request(originalRequest);
          }
        } catch (e) {
          return Promise.reject(error);
        }
        return Promise.reject(error);
      },
    );
  }

  public async convertTextToRawVoiceFile(data: TTSData): Promise<TTSVoiceFileData> {
    try {
      const fileName = await this.getTTSFile(new YandexDataAdapter(data.text));
      return {
        fileName,
        generatedFileName: fileName.slice(0, fileName.lastIndexOf('.')),
        fullFilePath: FileUtilsService.getFullPath(this.voicePath),
        format: this.format,
      };
    } catch (e) {
      throw e;
    }
  }

  private async getTTSFile(yandexDataAdapter: YandexDataAdapter): Promise<string> {
    try {
      const response = await this.send(yandexDataAdapter);
      const fileName = `yandex-${uuid.v4()}.${this.format}`;
      await this.saveTTSFile(response, fileName);
      return fileName;
    } catch (e) {
      throw e;
    }
  }

  private async saveTTSFile(response: AxiosResponse, voiceFile: string): Promise<boolean> {
    const writer = await FileUtilsService.writeStreamVoiceFile(voiceFile, this.voicePath);
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;

      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  }

  private async send(yandexDataAdapter: YandexDataAdapter) {
    const queryString = new URLSearchParams({ ...this.getTTSData(yandexDataAdapter) }).toString();
    return await firstValueFrom(
      this.httpService.post(this.configService.get('yandex.ttsUrl'), queryString, await this.getHeader()).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );
  }

  private getTTSData(yandexDataAdapter: YandexDataAdapter): YandexSpeech {
    return {
      ...yandexDataAdapter,
      folderId: this.configService.get('yandex.folderId'),
    };
  }

  private async getHeader(): Promise<any> {
    const token = await this.iamToken.getIAMToken();
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      responseType: 'stream',
    };
  }
}
