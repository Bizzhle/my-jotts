import { Module } from '@nestjs/common';
import { CertificateModule } from '../certificates/certificate.module';
import { JwtSigningService } from './services/jwt-signing.services';
import { MailerService } from './services/mailer.services';
import { RequestContextService } from './services/request-context.service';

@Module({
  imports: [CertificateModule],
  providers: [MailerService, JwtSigningService, RequestContextService],
  exports: [MailerService, JwtSigningService, RequestContextService],
})
export class UtilsModule {}
