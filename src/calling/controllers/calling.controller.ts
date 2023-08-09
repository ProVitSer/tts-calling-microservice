import { Body, Controller, Param, Post, Res, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { Response } from 'express';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTasIdkDTO } from '../dto/calling-task-id.dto';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { CallingTaskService } from '../services/calling-task.service';
import { CallingTaskUpdateVoiceFileDTO } from '../dto/calling-task-update-voice-file.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationId } from '@app/application/interfaces/application.interface';
import { Calling } from '../calling.schema';
import { CallingTaskModifyResult } from '../interfaces/calling.interface';

@ApiTags('calling')
@Controller('calling')
export class CallingController {
  constructor(private readonly callingTaskService: CallingTaskService) {}

  @HttpCode(HttpStatus.OK)
  @Post('task')
  @ApiBody({ type: CallingTTSTaskDTO })
  @ApiOperation({ summary: 'Создание задачи на обзвон по списку и озвучкой переданного текста' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уникальный идентификатор обзвона',
    type: ApplicationId,
  })
  async setCallingTask(@Body() body: CallingTTSTaskDTO) {
    return await this.callingTaskService.createCallingTask(body);
  }

  @Post('result')
  @ApiExcludeEndpoint()
  async result(@Body() body: CallingResultDTO, @Res() res: Response) {
    try {
      this.callingTaskService.setCallingTaskResult(body);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(200);
    }
  }

  @Get('task/result/:applicationId')
  @ApiOperation({ summary: 'Получение результата обзвона по задаче' })
  @ApiParam({
    name: 'applicationId',
    required: true,
    description: 'Уникальный идентификатор задачи существующий в базе данных',
    type: String,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Уникальный идентификатор обзвона',
    type: Calling,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача с запрашиваемым applicationId не найден',
  })
  async getTaskResult(@Param('applicationId') applicationId: string) {
    return await this.callingTaskService.getCallingTaskResult(applicationId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('task/stop')
  @ApiOperation({ summary: 'Остановить выполнение ранее запущенной задачи на обзвон' })
  @ApiBody({ type: CallingTasIdkDTO })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Результат выполнения',
    type: CallingTaskModifyResult,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача с запрашиваемым applicationId не найден',
  })
  async stopTask(@Body() { applicationId }: CallingTasIdkDTO) {
    await this.callingTaskService.updateCallingTaskStatus(applicationId, ApplicationApiActionStatus.stop);
    return { result: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('task/cancel')
  @ApiOperation({ summary: 'Отменить выполнение ранее запущенной задачи на обзвон' })
  @ApiBody({ type: CallingTasIdkDTO })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Результат выполнения',
    type: CallingTaskModifyResult,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача с запрашиваемым applicationId не найден',
  })
  async cancelTask(@Body() { applicationId }: CallingTasIdkDTO) {
    await this.callingTaskService.updateCallingTaskStatus(applicationId, ApplicationApiActionStatus.cancel);
    return { result: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('task/continue')
  @ApiOperation({ summary: 'Продолжить выполнение ранее остановленной задачи на обзвон' })
  @ApiBody({ type: CallingTasIdkDTO })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Результат выполнения',
    type: CallingTaskModifyResult,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача с запрашиваемым applicationId не найден',
  })
  async continueTask(@Body() { applicationId }: CallingTasIdkDTO) {
    await this.callingTaskService.continueCallingTask(applicationId);
    return { result: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('task/update/voice-file')
  @ApiOperation({ summary: 'Обновить голосовой файл по остановленной задаче' })
  @ApiBody({ type: CallingTaskUpdateVoiceFileDTO })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Результат выполнения',
    type: CallingTaskModifyResult,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача с запрашиваемым applicationId не найден',
  })
  async updteFileTask(@Body() body: CallingTaskUpdateVoiceFileDTO) {
    try {
      await this.callingTaskService.updateCallingTaskTTSVoiceFile(body);
      return { result: true };
    } catch (e) {
      throw e;
    }
  }
}
