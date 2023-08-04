import { Body, Controller, Post } from '@nestjs/common';
import { CallingTTSDTO } from './dto/calling-tts.dto';
import { CallingService } from './calling.service';

@Controller('calling')
export class CallingController {
  constructor(private readonly callingService: CallingService) {}

  @Post('tts')
  async stopCheck(@Body() body: CallingTTSDTO): Promise<void> {
    try {
      return await this.callingService.setCallingTask(body);
    } catch (e) {
      throw e;
    }
  }
}
