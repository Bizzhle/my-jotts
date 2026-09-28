import { Module } from '@nestjs/common';
import { CertificateModule } from '../certificates/certificate.module';
import { EmailProcessor } from './services/email.processor';
import { JwtSigningService } from './services/jwt-signing.services';
import { MailerService } from './services/mailer.services';
import { RequestContextService } from './services/request-context.service';

@Module({
  imports: [CertificateModule],
  providers: [MailerService, JwtSigningService, RequestContextService, EmailProcessor],
  exports: [MailerService, JwtSigningService, RequestContextService],
})
export class UtilsModule {}
