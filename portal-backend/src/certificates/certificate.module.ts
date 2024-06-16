import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SigningSecret } from './entities/signing-secret.entity';
import { SigningSecretService } from './services/signing-secret.service';

@Module({
  imports: [TypeOrmModule.forFeature([SigningSecret])],
  providers: [SigningSecretService],
  exports: [SigningSecretService],
})
export class CertificateModule {}
