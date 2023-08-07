import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calling, CallingDocument } from '../calling.schema';
import { ApplicationApiActionStatus } from '@app/application/interfaces/application.enum';

@Injectable()
export class CallingService {
  constructor(@InjectModel(Calling.name) private callingModel: Model<CallingDocument>) {}

  public async saveCallingTask(data: Calling): Promise<Calling> {
    const callingTask = new this.callingModel({ ...data });
    await callingTask.save();
    return callingTask;
  }

  public async getTaskByApplicationId(applicationId: string): Promise<Calling | null> {
    return await this.callingModel.findOne({ applicationId }, { _id: 0, __v: 0, created: 0, changed: 0 });
  }

  public async update(filter: { [key: string]: any }, data: { [key: string]: any }) {
    return await this.callingModel.updateOne({ ...filter }, { $set: { ...data } });
  }

  public async isTaskExist(applicationId: string): Promise<boolean> {
    const callingTask = await this.getTaskByApplicationId(applicationId);
    return callingTask !== null;
  }

  public async isTaskCancel(applicationId: string): Promise<boolean> {
    const callingTask = await this.getTaskByApplicationId(applicationId);
    return callingTask.status == ApplicationApiActionStatus.cancel;
  }
}
