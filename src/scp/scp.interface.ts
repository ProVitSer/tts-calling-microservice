export interface BaseScpConnect {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface UploadData extends BaseScpConnect {
  uploadFilePath: string;
  serverFilePath: string;
}
