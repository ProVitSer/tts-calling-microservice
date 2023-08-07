import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provider';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UtilsService } from './utils/utils.service';

async function bootstrap() {
  const config = new ConfigService(configuration());
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          if (!!error.constraints) {
            return {
              field: error.property,
              error: error.constraints,
            };
          } else if (Array.isArray(error.children) && error.children.length > 0) {
            return UtilsService.formatError(error);
          }
        });
        return new HttpException(messages.length > 1 ? messages : messages[0], HttpStatus.BAD_REQUEST);
      },
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(config.get('appPort'));
}
bootstrap();
