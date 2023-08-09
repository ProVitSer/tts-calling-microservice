import { UtilsService } from '@app/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { ApplicationId } from './interfaces/application.interface';

@Injectable()
export class ApplicationService {
  static getApplicationId(needUuid?: boolean): ApplicationId {
    return {
      applicationId: UtilsService.generateId(needUuid),
    };
  }
}
