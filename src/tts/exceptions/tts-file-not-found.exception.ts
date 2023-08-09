import { NotFoundException } from '@nestjs/common';

class TTSFileNotFoundException extends NotFoundException {
  constructor(fileId: string, description?: string) {
    const message = description || `Файл с id ${fileId} отсутствует`;
    super(message);
  }
}

export default TTSFileNotFoundException;
