import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';

export interface CallingTTSData extends CallingTTSTaskDTO {
  applicationId: string;
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
