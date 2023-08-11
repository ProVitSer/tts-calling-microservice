import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provider';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UtilsService } from './utils/utils.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  const swaggerConfig = new DocumentBuilder().setTitle('API tts calling').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(config.get('appPort'));
}
bootstrap();
