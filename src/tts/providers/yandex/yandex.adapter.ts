import {
  YandexSpeechEmotion,
  YandexSpeechFormat,
  YandexSpeechLang,
  YandexSpeechSampleRateHertz,
  YandexSpeechSpeed,
  YandexSpeechVoice,
} from './interfaces/types';

export class YandexDataAdapter {
  voice: YandexSpeechVoice;
  text: string;
  format: YandexSpeechFormat;
  sampleRateHertz: YandexSpeechSampleRateHertz;
  lang: YandexSpeechLang;
  emotion: YandexSpeechEmotion;
  speed: YandexSpeechSpeed;

  constructor(text: string) {
    this.text = text;
    this.voice = YandexSpeechVoice.alena;
    this.format = YandexSpeechFormat.lpcm;
    this.sampleRateHertz = YandexSpeechSampleRateHertz.Eight;
    this.lang = YandexSpeechLang.RU;
    this.emotion = YandexSpeechEmotion.good;
    this.speed = YandexSpeechSpeed.middle;
  }
}
