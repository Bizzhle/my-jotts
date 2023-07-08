import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'your-secret-key',
  signOptions: { expiresIn: '1h' }, // Optional: token expiration time
};
