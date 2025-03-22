import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

export function EnvironmentConfigRootModule() {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [join(__dirname, '../../.env'), `.env.${process.env['NODE_ENV']}`, '.env'],
  });
}
