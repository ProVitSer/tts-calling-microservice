import { Body, Controller, Param, Post, Res, Get, Put } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Response } from 'express';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTaskService } from '../services/calling-task.service';
import { ApplicationId } from '@app/application/interfaces/application.interface';
import { CallingTaskResultService } from '../services/calling-task-result.service';
import { CallingTasIdkDTO } from '../dto/calling-task-id.dto';
import { CallingSetStatusResult } from '../interfaces/calling.interface';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';

@Controller('calling')
export class CallingController {
  constructor(
    private readonly callingTaskService: CallingTaskService,
    private readonly callingTaskResultService: CallingTaskResultService,
  ) {}

  @Post('task')
  async setCallingTask(@Body() body: CallingTTSTaskDTO): Promise<ApplicationId> {
    try {
      return await this.callingTaskService.setCallingTaskWithTTS(body);
    } catch (e) {
      throw e;
    }
  }

  @Post('result')
  async result(@Body() body: CallingResultDTO, @Res() res: Response): Promise<any> {
    try {
      this.callingTaskResultService.setResult(body);
      return res.sendStatus(200);
    } catch (e) {
      throw e;
    }
  }

  @Get('applicationId/:id')
  async getTask(@Param('id') applicationId: string): Promise<any> {
    try {
      return await this.callingTaskResultService.getTaskResult(applicationId);
    } catch (e) {
      throw e;
    }
  }

  @Post('stop')
  async stopTask(@Body() { applicationId }: CallingTasIdkDTO): Promise<CallingSetStatusResult> {
    try {
      await this.callingTaskService.updateTaskStatus(applicationId, ApplicationApiActionStatus.stop);
      return { result: true };
    } catch (e) {
      throw e;
    }
  }

  @Post('cancel')
  async cancelTask(@Body() { applicationId }: CallingTasIdkDTO): Promise<CallingSetStatusResult> {
    try {
      await this.callingTaskService.updateTaskStatus(applicationId, ApplicationApiActionStatus.cancel);
      return { result: true };
    } catch (e) {
      throw e;
    }
  }

  @Post('continue')
  async continueTask(@Body() { applicationId }: CallingTasIdkDTO): Promise<CallingSetStatusResult> {
    try {
      await this.callingTaskService.continueTask(applicationId);
      return { result: true };
    } catch (e) {
      throw e;
    }
  }

  // @Post('task/file')
  // async updteFileTask(@Body() body: CallingTTSTaskDTO): Promise<ApplicationId> {
  //   try {
  //     return await this.callingTaskService.setCallingTaskWithTTS(body);
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
