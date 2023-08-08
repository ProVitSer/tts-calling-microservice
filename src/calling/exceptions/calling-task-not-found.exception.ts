import { NotFoundException } from '@nestjs/common';

class CallingTaskNotFoundException extends NotFoundException {
  constructor(applicationId: string, description?: string) {
    const message = description || `Задача с id ${applicationId} отсутствует`;
    console.log(applicationId);
    super(message);
  }
}

export default CallingTaskNotFoundException;
