import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { AppLoggerService } from './logger/services/app-logger.service';
import getLogLevels from './utils/get-log-levels';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://myjotts.com', 'https://myjotts.local']
      : ['http://localhost:5173'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api/v1', {
    exclude: [
      // Exclude the entire auth controller
      { path: 'api/auth', method: RequestMethod.ALL },
      { path: 'api/auth/(.*)', method: RequestMethod.ALL },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );
  app.useLogger(app.get(AppLoggerService));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Portal Backend Api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // if (process.env.NODE_ENV !== 'production') {
  //   await seedLocalUsers();
  // }

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
