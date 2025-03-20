import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { EnvVars } from '../../envvars';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private region: string;
  private bucket: string;
  private s3: AWS.S3;

  constructor(
    private configService: ConfigService<EnvVars>,
    private readonly logger: AppLoggerService,
  ) {
    this.region = this.configService.get<string>('AWS_S3_REGION');
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_S3_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async upload(file) {
    const params = {
      Bucket: this.bucket,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const data = await this.s3.upload(params).promise();

      return data;
    } catch (err) {
      this.logger.warn('file could not be uploaded to S3 bucket');
    }
  }

  async deleteUploadFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (err) {
      throw new HttpException('Cannot delete image', err);
    }
  }

  async getImageStreamFromS3(key: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return data.Body.toString();
    } catch (err) {
      throw new NotFoundException('Could not fetch image', err);
    }
  }
}
