import { Body, Controller, Param, Post, Res, Get } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Response } from 'express';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTasIdkDTO } from '../dto/calling-task-id.dto';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { CallingTaskService } from '../services/calling-task.service';
import { CallingTaskUpdateVoiceFileDTO } from '../dto/calling-task-update-voice-file.dto';

@Controller('calling')
export class CallingController {
  constructor(private readonly callingTaskService: CallingTaskService) {}

  @Post('task')
  async setCallingTask(@Body() body: CallingTTSTaskDTO) {
    return await this.callingTaskService.createCallingTask(body);
  }

  @Post('result')
  async result(@Body() body: CallingResultDTO, @Res() res: Response) {
    try {
      this.callingTaskService.setCallingTaskResult(body);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(200);
    }
  }

  @Get('applicationId/:id')
  async getTask(@Param('id') applicationId: string) {
    return await this.callingTaskService.getCallingTaskResult(applicationId);
  }

  @Post('stop')
  async stopTask(@Body() { applicationId }: CallingTasIdkDTO) {
    await this.callingTaskService.updateCallingTaskStatus(applicationId, ApplicationApiActionStatus.stop);
    return { result: true };
  }

  @Post('cancel')
  async cancelTask(@Body() { applicationId }: CallingTasIdkDTO) {
    return await this.callingTaskService.updateCallingTaskStatus(applicationId, ApplicationApiActionStatus.cancel);
    return { result: true };
  }

  @Post('continue')
  async continueTask(@Body() { applicationId }: CallingTasIdkDTO) {
    return await this.callingTaskService.continueCallingTask(applicationId);
    return { result: true };
  }

  @Post('task/update/voice-file')
  async updteFileTask(@Body() body: CallingTaskUpdateVoiceFileDTO) {
    try {
      return await this.callingTaskService.updateCallingTaskTTSVoiceFile(body);
    } catch (e) {
      throw e;
    }
  }
}
