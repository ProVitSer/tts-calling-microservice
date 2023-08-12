import { Body, Controller, Get, Param, Post, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FileUtilsService } from '@app/utils/files.utils';
import { TTSDTO } from '../dto/tts.dto';
import { TTSService } from '../services/tts.service';
import { ApiTags, ApiParam, ApiBody, ApiOperation, ApiOkResponse, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ListVoicesData, TTSFile } from '../interfaces/tts.interface';
import { ParseObjectIdPipe } from '@app/pipe/parse-objectId.pipe';
import { TTSVoicesDTO } from '../dto/tts.voices.dto';

@ApiTags('tts')
@Controller('tts')
export class TTSController {
  constructor(private readonly ttsService: TTSService) {}

  @HttpCode(HttpStatus.OK)
  @Post('convert/online')
  @ApiBody({ type: TTSDTO })
  @ApiOperation({ summary: 'Озвучка заданного текста' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stream voice file response',
    content: {
      'application/octet-stream': {},
    },
  })
  async convert(@Body() data: TTSDTO, @Res() res: Response): Promise<any> {
    const { tts, ...convertData } = data;

    const ttsFile = await this.ttsService.textToSpech({ ...convertData, text: tts });
    const file = await FileUtilsService.readStreamVoiceFile(FileUtilsService.getFullFilePath(ttsFile));
    file.pipe(res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('convert/file')
  @ApiOperation({ summary: 'Преобразовать текст в голосовой файл' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уникальный идентификатор голосового файла в системе',
    type: TTSFile,
  })
  async file(@Body() data: TTSDTO): Promise<TTSFile> {
    const { tts, ...convertData } = data;
    return this.ttsService.convertTextToVoiceFile({ ...convertData, text: tts });
  }

  @Get('file/:fileId')
  @ApiOperation({ summary: 'Получение ранее преобразованного через tts звукового файла по fileId' })
  @ApiParam({
    name: 'fileId',
    required: true,
    description: 'Уникальный идентификатор преобразованного tts файла',
    type: String,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Stream voice file response',
    content: {
      'application/octet-stream': {},
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Файл с запрашиваемым fileId не найден',
  })
  async getTTSFile(@Param('fileId', new ParseObjectIdPipe()) fileId: string, @Res() res: Response) {
    const ttsFile = await this.ttsService.getTTSVoiceFile(fileId);
    const file = await FileUtilsService.readStreamVoiceFile(FileUtilsService.getFullFilePath(ttsFile));
    file.pipe(res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('voices')
  @ApiBody({ type: TTSVoicesDTO })
  @ApiOperation({ summary: 'Получение списка возможных голосов и эмоций' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уникальный идентификатор голосового файла в системе',
    type: [ListVoicesData],
  })
  async getVoices(@Body() { ttsType }: TTSVoicesDTO): Promise<ListVoicesData[]> {
    return await this.ttsService.getVoicesList(ttsType);
  }
}
