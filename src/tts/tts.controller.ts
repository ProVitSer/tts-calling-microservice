import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { FileUtilsService } from '@app/files/files-utils';
import { TTSDTO } from './dto/tts.dto';
import { TTSService } from './tts.service';
import { TTSFile } from './interfaces/tts.interface';
import { CONVERT_FILE_ERROR } from './tts.consts';

@Controller('tts')
export class TTSController {
  constructor(private readonly ttsService: TTSService) {}

  @Post('convert')
  async convert(@Body() { ttsType, tts }: TTSDTO, @Res() res: Response): Promise<any> {
    try {
      const ttsFile = await this.ttsService.textToSpech({ ttsType, text: tts });
      if (ttsFile) {
        const file = await FileUtilsService.readStreamVoiceFile(FileUtilsService.getFullFilePath(ttsFile));
        file.pipe(res);
      } else {
        throw CONVERT_FILE_ERROR;
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }

  @Post('file')
  async file(@Body() { ttsType, tts }: TTSDTO): Promise<TTSFile> {
    try {
      return this.ttsService.convertTextToVoiceFile({ ttsType, text: tts });
    } catch (e) {
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }

  @Get('file/:id')
  async getTTSFile(@Param('id') fileId: string, @Res() res: Response) {
    try {
      const ttsFile = await this.ttsService.getTTSVoiceFile(fileId);
      const file = await FileUtilsService.readStreamVoiceFile(FileUtilsService.getFullFilePath(ttsFile));
      file.pipe(res);
    } catch (e) {
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }
}
