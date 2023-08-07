import { ApplicationId } from '@app/application/interfaces/application.interface';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Calling } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';

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

export interface CallingSetStatusResult {
  result: boolean;
}

export interface CallingTaskServiceInterface {
  createCallingTask(data: CallingTTSTaskDTO): Promise<ApplicationId>;
  setCallingTaskResult(data: CallingResultDTO): Promise<void>;
  getCallingTaskResult(applicationId: string): Promise<Calling>;
  updateCallingTaskStatus(applicationId: string, status: ApplicationApiActionStatus): Promise<void>;
  continueCallingTask(applicationId: string): Promise<void>;
  //updateCallingTaskTTSVoiceFile(applicationId: string, fileId: string): Promise<boolean>;
}
