import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SigningSecret } from '../entities/signing-secret.entity';

@Injectable()
export class SigningSecretService {
  constructor(
    @InjectRepository(SigningSecret)
    private readonly signingSecretRepository: Repository<SigningSecret>,
  ) {}

  async getValidSecretKey() {
    const now = new Date();

    return this.signingSecretRepository.findOne({
      where: {
        expiry_date: MoreThanOrEqual(now),
      },
    });
  }
}
