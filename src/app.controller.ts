import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AsteriskAriACallService } from './asterisk/asterisk-ari-call.service';
import { AsteriskAriOriginate } from './asterisk/asterisk.interface';
import { TTSService } from './tts/tts.service';
import { TTSProviderType } from './tts/interfaces/tts.enum';

@Controller()
export class AppController {
  constructor(private readonly ast: AsteriskAriACallService, private readonly tts: TTSService) {}

  @Get()
  async getHello(): Promise<void> {
    const data = {
      id: '12312312312',
      ttsType: TTSProviderType.yandex,
      text: 'Ситуация банальна',
    };
    await this.tts.textToSpech(data);
    // const originatenfo: AsteriskAriOriginate = {
    //   endpoint: `PJSIP/74952042369@Mango`,
    //   callerId: '79300368205',
    //   context: 'tts',
    //   extension: '2222',
    //   variables: { playBack: 'custom/Monitoring' },
    // };
    // await this.ast.sendAriCall(originatenfo);
  }
}
