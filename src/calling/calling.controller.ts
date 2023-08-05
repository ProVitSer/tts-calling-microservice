import { Body, Controller, Post, Res } from '@nestjs/common';
import { CallingTTSTaskDTO } from './dto/calling-tts-task.dto';
import { CallingService } from './calling.service';

@Controller('calling')
export class CallingController {
  constructor(private readonly callingService: CallingService) {}

  @Post('task')
  async setCallingTask(@Body() body: CallingTTSTaskDTO): Promise<void> {
    try {
      return await this.callingService.setCallingTaskWithTTS(body);
    } catch (e) {
      throw e;
    }
  }
}
