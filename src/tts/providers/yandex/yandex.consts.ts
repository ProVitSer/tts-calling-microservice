import { YandexSpeechVoice, YandexSpeechEmotion } from './interfaces/yandex.enum';

export const VOICE_EMOTION_MAP: { [key in YandexSpeechVoice]: YandexSpeechEmotion[] } = {
  [YandexSpeechVoice.alena]: [YandexSpeechEmotion.neutral, YandexSpeechEmotion.good],
  [YandexSpeechVoice.filipp]: [YandexSpeechEmotion.neutral],
  [YandexSpeechVoice.jane]: [YandexSpeechEmotion.neutral, YandexSpeechEmotion.good, YandexSpeechEmotion.evil],
  [YandexSpeechVoice.omazh]: [YandexSpeechEmotion.neutral, YandexSpeechEmotion.evil],
  [YandexSpeechVoice.zahar]: [YandexSpeechEmotion.neutral, YandexSpeechEmotion.good],
  [YandexSpeechVoice.ermil]: [YandexSpeechEmotion.neutral, YandexSpeechEmotion.good],
  [YandexSpeechVoice.amira]: [YandexSpeechEmotion.neutral],
  [YandexSpeechVoice.john]: [YandexSpeechEmotion.neutral],
};
