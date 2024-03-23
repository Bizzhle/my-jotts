import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomLogger } from './logs/services/customLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // app.useLogger(true);
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useLogger(new CustomLogger());
  const config = new DocumentBuilder().setTitle('Portal Backend Api').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
}
bootstrap();
