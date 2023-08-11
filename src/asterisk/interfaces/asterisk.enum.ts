export enum ChannelType {
  PJSIP = 'PJSIP',
  SIP = 'SIP',
  LOCAL = 'local',
}

export enum AsteriskContext {
  fromInternalAdditional = 'from-internal-additional',
  callintTTS = 'tts',
}

export enum AsteriskDialStatus {
  ANSWER = 'ANSWER',
  CHANUNAVAIL = 'CHANUNAVAIL',
  CONGESTION = 'CONGESTION',
  NOANSWER = 'NOANSWER',
  BUSY = 'BUSY',
  CANCEL = 'CANCEL',
}
