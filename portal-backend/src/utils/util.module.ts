import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.services';
import { JwtSigningService } from './services/jwt-signing.services';
import { CertificateModule } from '../certificates/certificate.module';

@Module({
  imports: [CertificateModule],
  providers: [MailerService, JwtSigningService],
  exports: [MailerService, JwtSigningService],
})
export class UtilsModule {}
