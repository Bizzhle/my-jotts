import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { AppLoggerService } from '../../src/logger/services/app-logger.service';
import { UploadService } from '../../src/upload/service/upload.service';

export async function bootStrapApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(AppLoggerService)
    .useValue({
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      fatal: jest.fn(),
      setLogLevels: jest.fn(),
    })
    .overrideProvider(UploadService)
    .useValue({
      upload: jest.fn().mockResolvedValue({
        Location: 'https://mock-s3-url.com/file.jpg',
        Key: 'mock-key/file.jpg',
        Bucket: 'mock-bucket',
        ETag: '"mock-etag"',
      }),
      deleteUploadFile: jest.fn().mockResolvedValue(undefined),
      getImageStreamFromS3: jest.fn().mockResolvedValue(null),
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'api/auth', method: RequestMethod.ALL },
      { path: 'api/auth/(.*)', method: RequestMethod.ALL },
    ],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(false);

  app.use((req, _res, next) => {
    next();
  });

  return app;
}
