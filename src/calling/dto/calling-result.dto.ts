import { AsteriskDialStatus } from '@app/asterisk/interfaces/asterisk.enum';
import { IsEnum, IsString } from 'class-validator';

export class CallingResultDTO {
  @IsString()
  dstNumber: string;

  @IsString()
  uniqueid: string;

  @IsEnum(AsteriskDialStatus)
  @IsString()
  dialStatus: AsteriskDialStatus;

  @IsString()
  applicationId: string;

  @IsString()
  fileId: string;

  @IsString()
  callerId: string;
}
