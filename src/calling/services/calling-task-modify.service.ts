import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from '@app/files/files.service';
import { CallingService } from './calling.service';
import { Calling, CallingNumber } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { NOT_CALLED_NUMBER_IN_TASK, TASK_IS_CANCEL, TASK_NEED_STOP } from '../calling.consts';
import { CallingTaskPubService } from '../calling-mq/calling-task-pub.service';
import { CallingTaskUpdateVoiceFileDTO } from '../dto/calling-task-update-voice-file.dto';
import { ScpService } from '@app/scp/scp.service';
import { ConfigService } from '@nestjs/config';
import CallingTaskNotFoundException from '../exceptions/calling-task-not-found.exception';
import TTSFileNotFoundException from '@app/tts/exceptions/tts-file-not-found.exception';
import { CurrentCallingTaskOperation } from '../interfaces/calling.enum';

@Injectable()
export class CallingModifyTaskService {
  constructor(
    private readonly configService: ConfigService,
    private readonly callingTaskPubService: CallingTaskPubService,
    private readonly filesService: FilesService,
    private readonly callingService: CallingService,
    private readonly scp: ScpService,
  ) {}

  public async updateTaskStatus(applicationId: string, status: ApplicationApiActionStatus) {
    try {
      const task = await this.checkCallingTask(applicationId, CurrentCallingTaskOperation.updateStatus, status);

      if (await this.callingService.isTaskCancel(applicationId)) {
        throw new HttpException(`${TASK_IS_CANCEL}`, HttpStatus.FORBIDDEN);
      }

      await this.callingService.update({ applicationId }, { status });
      return;
    } catch (e) {
      throw e;
    }
  }

  public async continueTask(applicationId: string) {
    try {
      const task = await this.checkCallingTask(applicationId, CurrentCallingTaskOperation.continue);

      if (task.status == ApplicationApiActionStatus.cancel) {
        throw new HttpException(`${TASK_IS_CANCEL}`, HttpStatus.FORBIDDEN);
      }

      const file = await this.filesService.getFileById(task.fileId);
      await this.callingService.update({ applicationId }, { status: ApplicationApiActionStatus.inProgress });

      await this.callingTaskPubService.publishCallingTaskToQueue({ phones: this.getNotCalledNumbers(task), applicationId }, file);
    } catch (e) {
      throw e;
    }
  }

  public async updateTTSCallingFile(data: CallingTaskUpdateVoiceFileDTO): Promise<void> {
    try {
      const task = await this.checkCallingTask(data.applicationId, CurrentCallingTaskOperation.updateFile);
      if (task.status !== ApplicationApiActionStatus.stop) {
        throw new HttpException(`${TASK_NEED_STOP}`, HttpStatus.FORBIDDEN);
      }

      const file = await this.filesService.getFileById(data.fileId);
      if (file == null) {
        throw new TTSFileNotFoundException(data.fileId);
      }

      await this.scp.uploadFileToServer({
        ...this.scp.getAsteriskScpConnectData(),
        uploadFilePath: `${file.fullFilePath}${file.fileName}`,
        serverFilePath: `${this.configService.get('asterisk.ttsFilePath')}${file.fileName}`,
      });
      await this.callingService.update({ applicationId: data.applicationId }, { fileId: file._id });
    } catch (e) {
      throw e;
    }
  }

  private async checkCallingTask(
    applicationId: string,
    cur: CurrentCallingTaskOperation,
    status?: ApplicationApiActionStatus,
  ): Promise<Calling> {
    try {
      const task = await this.callingService.getTaskByApplicationId(applicationId);
      if (task == null) {
        throw new CallingTaskNotFoundException(applicationId);
      }
      if (cur == CurrentCallingTaskOperation.updateStatus) {
        this.checkByAppActStatus(task, status);
      } else {
        this.checkByCur(task, cur);
      }
      return task;
    } catch (e) {
      throw e;
    }
  }

  private checkByCur(task: Calling, cur: CurrentCallingTaskOperation) {
    switch (cur) {
      case CurrentCallingTaskOperation.continue:
        if (task.status !== ApplicationApiActionStatus.stop) {
          throw new HttpException(
            `Нельзя продолжить выполнение задачи, которая находиться на статусе ${task.status}`,
            HttpStatus.FORBIDDEN,
          );
        }
        break;
      case CurrentCallingTaskOperation.updateFile:
        if (task.status !== ApplicationApiActionStatus.stop) {
          throw new HttpException(
            `Нельзя обновить голосовой файл для задачи, которая находиться на статусе  ${task.status}`,
            HttpStatus.FORBIDDEN,
          );
        }
        break;
      default:
        throw new HttpException(`Ошибка которой не должно быть на данной стадии`, HttpStatus.FORBIDDEN);
    }
  }

  private checkByAppActStatus(task: Calling, status: ApplicationApiActionStatus) {
    switch (status) {
      case ApplicationApiActionStatus.cancel:
      case ApplicationApiActionStatus.stop:
        if (
          [
            ApplicationApiActionStatus.apiFail,
            ApplicationApiActionStatus.cancel,
            ApplicationApiActionStatus.stop,
            ApplicationApiActionStatus.completed,
          ].includes(task.status)
        ) {
          throw new HttpException(`Задача находиться в статусе ${task.status} ее нельзя остановить или отменить`, HttpStatus.FORBIDDEN);
        }
        break;
      default:
        throw new HttpException(`Нельзя изменить статус задачи на статус ${status}`, HttpStatus.FORBIDDEN);
    }
  }

  private getNotCalledNumbers(task: Calling): string[] {
    const notCalledNumber = task.numbers
      .map((number: CallingNumber) => {
        if (!number.hasOwnProperty('callerId')) {
          return number.dstNumber;
        }
      })
      .filter((n) => n !== undefined);
    if (notCalledNumber.length == 0) throw NOT_CALLED_NUMBER_IN_TASK;
    return notCalledNumber;
  }
}
