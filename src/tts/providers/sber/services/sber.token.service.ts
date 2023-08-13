import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SberApiUrl, SberScope } from '../interfaces/sber.enum';
import * as uuid from 'uuid';
import * as qs from 'qs';
import { SberTokenResponse } from '../interfaces/sber.interface';
import { getTime } from 'date-fns';

@Injectable()
export class SberTokenService implements OnModuleInit {
  private accessToken: string;
  private accessTokenExpiresAt: number;
  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}
  async onModuleInit() {
    const tokenData = await this._getAccessToken();
    this.accessToken = tokenData.access_token;
    this.accessTokenExpiresAt = tokenData.expires_at;
  }

  public async getAccessToken() {
    if (this.checkTokenExpires()) {
      const tokenData = await this._getAccessToken();
      this.updateTokenData(tokenData);
      return tokenData.access_token;
    }
    return this.accessToken;
  }

  private updateTokenData(tokenData: SberTokenResponse) {
    this.accessToken = tokenData.access_token;
    this.accessTokenExpiresAt = tokenData.expires_at;
  }

  private checkTokenExpires(): boolean {
    return this.accessTokenExpiresAt <= getTime(new Date());
  }

  private async _getAccessToken(): Promise<SberTokenResponse> {
    const response = await firstValueFrom(
      this.httpService.post<SberTokenResponse>(SberApiUrl.token, this.getTokenRequestData(), this.getTokenHeader()).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );
    return response.data;
  }

  private getTokenRequestData() {
    return qs.stringify({ scope: SberScope.personal });
  }

  private getTokenHeader() {
    return {
      headers: {
        Authorization: `Basic ${this.configService.get('sber.accessToken')}`,
        RqUID: uuid.v4(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  }
}
