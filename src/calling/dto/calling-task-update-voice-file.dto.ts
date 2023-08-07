import { IsNotEmpty, IsString } from 'class-validator';

export class CallingTaskUpdateVoiceFileDTO {
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}
