import { Containers } from 'ari-client';

export interface AsteriskAriOriginate {
  endpoint: string;
  extension?: string | undefined;
  context?: string | undefined;
  priority?: number | undefined;
  label?: string | undefined;
  app?: string | undefined;
  appArgs?: string | undefined;
  callerId?: string | undefined;
  timeout?: number | undefined;
  variables?: Containers | undefined;
  otherChannelId?: string | undefined;
  originator?: string | undefined;
  formats?: string | undefined;
}
