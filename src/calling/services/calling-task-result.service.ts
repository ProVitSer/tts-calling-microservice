import { Injectable } from '@nestjs/common';
import { CallingService } from './calling.service';
import { CallingResultDTO } from '../dto/calling-result.dto';
import { Calling, CallingNumber } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';
import { UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class CallingTaskResultService {
  constructor(private readonly callingService: CallingService) {}

  public async setResult(data: CallingResultDTO): Promise<void> {
    try {
      await this.updateTaskNumberResult(data);
      return await this.checkIsTaskCompleted(await this.callingService.getTaskByApplicationId(data.applicationId));
    } catch (e) {
      console.log(e);
    }
  }

  private async updateTaskNumberResult(data: CallingResultDTO) {
    try {
      const callingTask = await this.callingService.getTaskByApplicationId(data.applicationId);
      if (callingTask == null) {
        throw `Задача ${data.applicationId} отсутствует в базу`;
      }
      return await this.callingService.update(
        { applicationId: data.applicationId, 'numbers.dstNumber': data.dstNumber },
        this.getUpdateNumberData(data),
      );
    } catch (e) {
      throw e;
    }
  }

  private getUpdateNumberData(data: CallingResultDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { applicationId, ...result } = data;

    // Убираем инфу о двуканальности
    result.uniqueid.replace(/;2$/, '');
    const updateObject = {};
    const nestedObject = {};
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        nestedObject[key] = result[key];
      }
    }
    updateObject['numbers.$'] = nestedObject;
    return updateObject;
  }

  private checkIsTaskCompleted(callingTask: Calling): Promise<void> {
    let countWithoutStatus = 0;
    callingTask.numbers.forEach((n: CallingNumber) => {
      if (!n.hasOwnProperty('callerId')) {
        countWithoutStatus++;
      }
    });
    if (countWithoutStatus == 0) {
      this.setCompleted(callingTask.applicationId);
    }
    return;
  }

  private async setCompleted(applicationId: string): Promise<UpdateWriteOpResult> {
    try {
      return await this.callingService.update({ applicationId }, { status: ApplicationApiActionStatus.completed });
    } catch (e) {
      throw e;
    }
  }
}
