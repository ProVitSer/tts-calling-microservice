import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Files, FilesDocument } from './files.schema';
import { Model } from 'mongoose';
import { ID_ERROR } from './files.consts';

@Injectable()
export class FilesService {
  constructor(@InjectModel(Files.name) private filesModel: Model<FilesDocument>) {}

  public async saveFile(file: Files): Promise<Files & { _id: string }> {
    const files = new this.filesModel({
      ...file,
    });
    await files.save();
    const insertedId = files._id;

    return { ...file, _id: insertedId };
  }

  public async getFileById(fileId: string): Promise<Files | null> {
    try {
      return await this.filesModel.findById({ _id: fileId });
    } catch (e) {
      throw ID_ERROR;
    }
  }
}
