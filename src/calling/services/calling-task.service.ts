import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CallingTaskServiceInterface } from '../interfaces/calling.interface';
import { LoggerService } from '@app/logger/logger.service';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { ApplicationId } from '@app/application/interfaces/application.interface';
import { Calling } from '../calling.schema';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { CallingTTSTaskDTO } from '../dto/calling-tts-task.dto';
import { START_CALLING_TASK_ERROR, GET_CALLING_TASK_ERROR, UPDATE_FILE_ERROR, CONTINUE_FILE_ERROR } from '../calling.consts';
import { CallingTaskCreateService } from './calling-task-create.service';
import { CallingModifyTaskService } from './calling-task-modify.service';
import { CallingTaskResultService } from './calling-task-result.service';

@Injectable()
export class CallingTaskService implements CallingTaskServiceInterface {
  constructor(
    private readonly logger: LoggerService,
    private readonly callingTaskCreateService: CallingTaskCreateService,
    private readonly callingModifyTaskService: CallingModifyTaskService,
    private readonly callingTaskResultService: CallingTaskResultService,
  ) {}

  public async createCallingTask(data: CallingTTSTaskDTO): Promise<ApplicationId> {
    try {
      return await this.callingTaskCreateService.setCallingTaskWithTTS(data);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(START_CALLING_TASK_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async setCallingTaskResult(data: CallingResultDTO): Promise<void> {
    try {
      await this.callingTaskResultService.setResult(data);
    } catch (e) {
      this.logger.error(e);
    }
  }

  public async getCallingTaskResult(applicationId: string): Promise<Calling> {
    try {
      return await this.callingTaskResultService.getTaskResult(applicationId);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(GET_CALLING_TASK_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateCallingTaskStatus(applicationId: string, status: ApplicationApiActionStatus): Promise<void> {
    try {
      return await this.callingModifyTaskService.updateTaskStatus(applicationId, status);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(UPDATE_FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async continueCallingTask(applicationId: string): Promise<void> {
    try {
      return await this.callingModifyTaskService.continueTask(applicationId);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(CONTINUE_FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
