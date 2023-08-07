import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from '@app/files/files.service';
import { CallingService } from './calling.service';
import { Calling, CallingNumber } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { NOT_CALLED_NUMBER_IN_TASK, TASK_IS_CANCEL, TASK_NOT_FOUND } from '../calling.consts';
import { CallingTaskPubService } from '../calling-mq/calling-task-pub.service';
import { CallingTaskUpdateVoiceFileDTO } from '../dto/calling-task-update-voice-file.dto';
import { ScpService } from '@app/scp/scp.service';
import { ConfigService } from '@nestjs/config';

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
      if (!(await this.callingService.isTaskExist(applicationId))) {
        throw new HttpException(`${TASK_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }
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
      if (!(await this.callingService.isTaskExist(applicationId))) {
        throw new HttpException(`${TASK_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }

      const task = await this.callingService.getTaskByApplicationId(applicationId);
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
      const file = await this.filesService.getFileById(data.fileId);
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
