import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { EnvVars } from '../../envvars';
import { AppLoggerService } from '../../logger/services/app-logger.service';

@Injectable()
export class UploadService {
  private bucket: string;
  private s3: AWS.S3;

  constructor(
    private configService: ConfigService<EnvVars>,
    private readonly logger: AppLoggerService,
  ) {
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

  async getImageStreamFromS3(key: string): Promise<string | null> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const signedUrl = await this.s3.getSignedUrl('getObject', params); // 1 hour
      return signedUrl;
    } catch (err) {
      await this.logger.error('Error getting image stream from S3', err);
      return null;
    }
  }
}
