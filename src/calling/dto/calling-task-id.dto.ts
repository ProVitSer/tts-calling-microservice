import { IsNotEmpty, IsString } from 'class-validator';

export class CallingTasIdkDTO {
  @IsString()
  @IsNotEmpty()
  applicationId: string;
}
