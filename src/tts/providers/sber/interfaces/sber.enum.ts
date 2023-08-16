export enum SberScope {
  personal = 'SALUTE_SPEECH_PERS',
  corp = 'SALUTE_SPEECH_CORP',
  oldCorp = 'SBER_SPEECH',
}

export enum SberApiUrl {
  token = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
  tts = 'https://smartspeech.sber.ru/rest/v1/text:synthesize',
}

export enum SberSpeechVoice {
  Nec = 'Nec',
  Bys = 'Bys',
  May = 'May',
  Tur = 'Tur',
  Ost = 'Ost',
  Pon = 'Pon',
  Kin = 'Kin',
}

export enum SberSpeechSampleRateHertz {
  Twentyfour = 24000,
  Eight = 8000,
}

export enum SberSpeechFormat {
  wav = 'wav16',
  pcm = 'pcm16_se',
  opus = 'opus',
}

export enum SberContentType {
  text = 'text',
  ssml = 'ssml',
}
