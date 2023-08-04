import { Injectable } from '@nestjs/common';
import { CallingTTSDTO } from './dto/calling-tts.dto';
import { TTSService } from '@app/tts/tts.service';

@Injectable()
export class CallingService {
  constructor(private readonly tts: TTSService) {}

  public async setCallingTask(data: CallingTTSDTO): Promise<void> {
    try {
    } catch (e) {
      console.log(e);
    }
  }
}
