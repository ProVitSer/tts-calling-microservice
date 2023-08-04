import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CallingTTSDTO {
  @IsString()
  @IsNotEmpty()
  tts: string;

  @IsNotEmpty()
  @IsArray()
  phones: string[];

  @IsString()
  @IsNotEmpty()
  applicationId: string;
}
