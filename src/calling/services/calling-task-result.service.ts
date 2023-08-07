import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CallingService } from './calling.service';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { Calling, CallingNumber } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { UpdateWriteOpResult } from 'mongoose';
import { TASK_NOT_FOUND } from '../calling.consts';

@Injectable()
export class CallingTaskResultService {
  constructor(private readonly callingService: CallingService) {}

  public async setResult(data: CallingResultDTO): Promise<void> {
    try {
      await this.updateTaskNumberResult(data);
      return await this.checkIsTaskCompleted(await this.callingService.getTaskByApplicationId(data.applicationId));
    } catch (e) {
      throw e;
    }
  }

  public async getTaskResult(applicationId: string) {
    try {
      if (!(await this.callingService.isTaskExist(applicationId))) {
        throw new HttpException(`${TASK_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }
      return await this.callingService.getTaskByApplicationId(applicationId);
    } catch (e) {
      throw e;
    }
  }

  private async updateTaskNumberResult(data: CallingResultDTO): Promise<UpdateWriteOpResult> {
    try {
      if (!(await this.callingService.isTaskExist(data.applicationId))) {
        throw new HttpException(`${TASK_NOT_FOUND}`, HttpStatus.NOT_FOUND);
      }
      return await this.callingService.update(
        { applicationId: data.applicationId, 'numbers.dstNumber': data.dstNumber },
        this.getUpdateNumberData(data),
      );
    } catch (e) {
      throw e;
    }
  }

  private getUpdateNumberData(data: CallingResultDTO): { [key: string]: any } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { applicationId, ...result } = data;

    // Убираем инфу о двуканальности
    result.uniqueid = result.uniqueid.replace(/;2$/, '');
    const updateObject: { [key in keyof Omit<CallingResultDTO, 'applicationId'>]?: string } = {};
    const nestedObject = {};
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        nestedObject[key] = result[key];
      }
    }
    nestedObject['callDate'] = new Date().toISOString();
    updateObject['numbers.$'] = nestedObject;

    return updateObject;
  }

  private async checkIsTaskCompleted(callingTask: Calling): Promise<void> {
    let countWithoutStatus = 0;
    callingTask.numbers.forEach((n: CallingNumber) => {
      if (!n.hasOwnProperty('callerId')) {
        countWithoutStatus++;
      }
    });
    if (countWithoutStatus == 0) {
      await this.callingService.update({ applicationId: callingTask.applicationId }, { status: ApplicationApiActionStatus.completed });
    }
    return;
  }
}
