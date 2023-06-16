import { ConfigModule } from '@nestjs/config';

export function EnvironmentConfigRootModule() {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [`.env.${process.env['NODE_ENV']}`, '.env'],
  });
}
