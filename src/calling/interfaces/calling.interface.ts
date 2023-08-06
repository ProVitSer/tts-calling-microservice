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
