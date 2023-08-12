import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UtilsService } from '@app/utils/utils.service';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class TinkoffGRPCAuth {
  public static jwtMetadataGenerator(apiKey: string, secretKey: string, issuer?: string, subject?: string) {
    return (params: any, callback: any) => {
      const authPayload = {
        iss: issuer,
        sub: subject,
        aud: params['service_url'].split('/').pop(),
      };

      const token = this.generateJwt(apiKey, secretKey, authPayload);
      const metadata = new Metadata();
      metadata.set('authorization', 'Bearer ' + token);
      callback(null, metadata);
    };
  }

  public static generateJwt(apiKey: string, secretKey: string, payload: { [key: string]: any }): string {
    const expirationTime = 600;
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      kid: apiKey,
    };
    payload['exp'] = Math.floor(Date.now() / 1000) + expirationTime;
    const headerBytes = JSON.stringify(header);
    const payloadBytes = JSON.stringify(payload);
    const data = UtilsService.base64Encode(headerBytes) + '.' + UtilsService.base64Encode(payloadBytes);
    const hmac = crypto.createHmac('sha256', UtilsService.base64Decode(secretKey)).update(data, 'utf8').digest();
    const signature = UtilsService.base64Encode(hmac as unknown as string);
    return data + '.' + signature;
  }
}
