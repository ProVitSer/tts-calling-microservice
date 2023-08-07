import { Body, Controller, Param, Post, Res, Get } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Response } from 'express';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTaskService } from '../services/calling-task.service';
import { CallingTaskResultService } from '../services/calling-task-result.service';
import { CallingTasIdkDTO } from '../dto/calling-task-id.dto';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';

@Controller('calling')
export class CallingController {
  constructor(
    private readonly callingTaskService: CallingTaskService,
    private readonly callingTaskResultService: CallingTaskResultService,
  ) {}

  @Post('task')
  async setCallingTask(@Body() body: CallingTTSTaskDTO) {
    return await this.callingTaskService.setCallingTaskWithTTS(body);
  }

  @Post('result')
  async result(@Body() body: CallingResultDTO, @Res() res: Response) {
    try {
      this.callingTaskResultService.setResult(body);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(200);
    }
  }

  @Get('applicationId/:id')
  async getTask(@Param('id') applicationId: string) {
    return await this.callingTaskResultService.getTaskResult(applicationId);
  }

  @Post('stop')
  async stopTask(@Body() { applicationId }: CallingTasIdkDTO) {
    return await this.callingTaskService.updateTaskStatus(applicationId, ApplicationApiActionStatus.stop);
  }

  @Post('cancel')
  async cancelTask(@Body() { applicationId }: CallingTasIdkDTO) {
    return await this.callingTaskService.updateTaskStatus(applicationId, ApplicationApiActionStatus.cancel);
  }

  @Post('continue')
  async continueTask(@Body() { applicationId }: CallingTasIdkDTO) {
    return await this.callingTaskService.continueTask(applicationId);
  }

  // @Post('task/file')
  // async updteFileTask(@Body() body: CallingTTSTaskDTO) {
  //   try {
  //     return await this.callingTaskService.setCallingTaskWithTTS(body);
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
