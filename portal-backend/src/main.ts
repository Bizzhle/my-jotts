import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { AppLoggerService } from './logger/services/app-logger.service';
import getLogLevels from './utils/get-log-levels';
import { trustedOrigins } from './utils/trusted-origins';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
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
  app.enableCors({
    origin: trustedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    optionsSuccessStatus: 204,
  });
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
