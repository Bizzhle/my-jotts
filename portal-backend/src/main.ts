import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { AppLoggerService } from './logger/services/app-logger.service';
import getLogLevels from './utils/get-log-levels';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://www.myjotts.com', 'https://myjotts.com']
        : ['http://localhost:5173', 'http://myjotts.local'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    optionsSuccessStatus: 204,
  });
  app.useLogger(app.get(AppLoggerService));
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Portal Backend Api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000, '0.0.0.0');
}
bootstrap();
