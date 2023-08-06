import { Body, Controller, Param, Post, Res, Get, Put } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Response } from 'express';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTaskService } from '../services/calling-task.service';
import { ApplicationId } from '@app/application/interfaces/application.interface';
import { CallingTaskResultService } from '../services/calling-task-result.service';

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

  // @Get('applicationId/:id')
  // async getTask(@Param('id') fileId: string, @Res() res: Response): Promise<any> {
  //   try {
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // @Post('stop')
  // async stopTask(@Body() body: any, @Res() res: Response): Promise<any> {
  //   try {
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // @Post('continue')
  // async continueTask(@Body() body: any, @Res() res: Response): Promise<any> {
  //   try {
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // @Post('restart')
  // async restartTask(@Body() body: any, @Res() res: Response): Promise<any> {
  //   try {
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // @Post('cancel')
  // async cancelTask(@Body() body: any, @Res() res: Response): Promise<any> {
  //   try {
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // @Put('task/file')
  // async updteFileTask(@Body() body: CallingTTSTaskDTO): Promise<ApplicationId> {
  //   try {
  //     return await this.callingTaskService.setCallingTaskWithTTS(body);
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
