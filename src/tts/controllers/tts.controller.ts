import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileUtilsService } from '@app/utils/files-utils';
import { TTSDTO } from '../dto/tts.dto';
import { TTSService } from '../services/tts.service';

@Controller('tts')
export class TTSController {
  constructor(private readonly ttsService: TTSService) {}

  @Post('convert')
  async convert(@Body() { ttsType, tts }: TTSDTO, @Res() res: Response): Promise<any> {
    const ttsFile = await this.ttsService.textToSpech({ ttsType, text: tts });
    const file = await FileUtilsService.readStreamVoiceFile(FileUtilsService.getFullFilePath(ttsFile));
    file.pipe(res);
  }

  @Post('file')
  async file(@Body() { ttsType, tts }: TTSDTO) {
    return this.ttsService.convertTextToVoiceFile({ ttsType, text: tts });
  }

  @Get('file/:id')
  async getTTSFile(@Param('id') fileId: string, @Res() res: Response) {
    const ttsFile = await this.ttsService.getTTSVoiceFile(fileId);
    const file = await FileUtilsService.readStreamVoiceFile(FileUtilsService.getFullFilePath(ttsFile));
    file.pipe(res);
  }
}
