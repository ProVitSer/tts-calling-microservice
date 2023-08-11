import { ApplicationId } from '@app/application/interfaces/application.interface';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Calling } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { CallingTaskUpdateVoiceFileDTO } from '../dto/calling-task-update-voice-file.dto';
import { ApiProperty } from '@nestjs/swagger';

export interface CallingTTSData {
  applicationId: string;
  phones: string[];
}

export interface CallingPubSubInfo {
  applicationId: string;
  fileId: string;
  playBackFile: string;
  phone: string;
}

export interface AddCallingTaskData {
  applicationId: string;
  fileId: string;
  numbers: string[];
}

export class CallingTaskModifyResult {
  @ApiProperty({ type: 'boolean', description: 'Резульаь изменения задачи на обзвон', example: 'true' })
  result: boolean;
}

export interface CallingTaskServiceInterface {
  createCallingTask(data: CallingTTSTaskDTO): Promise<ApplicationId>;
  setCallingTaskResult(data: CallingResultDTO): Promise<void>;
  getCallingTaskResult(applicationId: string): Promise<Calling>;
  updateCallingTaskStatus(applicationId: string, status: ApplicationApiActionStatus): Promise<void>;
  continueCallingTask(applicationId: string): Promise<void>;
  updateCallingTaskTTSVoiceFile(data: CallingTaskUpdateVoiceFileDTO): Promise<void>;
}
