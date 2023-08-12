import { TTSData } from '@app/tts/interfaces/tts.interface';
import {
  YandexSpeechEmotion,
  YandexSpeechFormat,
  YandexSpeechLang,
  YandexSpeechSampleRateHertz,
  YandexSpeechSpeed,
  YandexSpeechVoice,
} from '../interfaces/yandex.enum';

export class YandexSpeechDataAdapter {
  voice: YandexSpeechVoice;
  text: string;
  format: YandexSpeechFormat;
  sampleRateHertz: YandexSpeechSampleRateHertz;
  lang: YandexSpeechLang;
  emotion: YandexSpeechEmotion;
  speed: YandexSpeechSpeed;

  constructor(data: TTSData) {
    this.text = data.text;
    this.voice = (data.voice as YandexSpeechVoice) || YandexSpeechVoice.alena;
    this.format = YandexSpeechFormat.lpcm;
    this.sampleRateHertz = YandexSpeechSampleRateHertz.FortyEight;
    this.lang = YandexSpeechLang.RU;
    this.emotion = (data.emotion as YandexSpeechEmotion) || YandexSpeechEmotion.good;
    this.speed = YandexSpeechSpeed.middle;
  }
}
