import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

export function EnvironmentConfigRootModule() {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: resolve(__dirname, '../../../../.env'),
  });
}
