import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { EnvVars } from '../../envvars';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { FileUploadDto } from '../dto/upload.dto';

interface S3UploadResult {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
}

@Injectable()
export class UploadService {
  private bucket: string;
  private region: string;
  private s3: S3Client;
  private environment: string;

  constructor(
    private configService: ConfigService<EnvVars>,
    private readonly logger: AppLoggerService,
  ) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.region = this.configService.get<string>('AWS_S3_REGION');
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.environment = this.configService.get<string>('NODE_ENV');
  }

  async upload(data: FileUploadDto) {
    const isProduction = this.environment === 'production';
    const key = isProduction
      ? `users/${data.userId}/activities/${data.activityId}/${uuidv4()}-${data.file.originalname}`
      : `users/${data.userId}/activities/dev/${data.activityId}/${uuidv4()}-${data.file.originalname}`;

    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: data.file.buffer,
      ContentType: data.file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const result = await this.s3.send(new PutObjectCommand(params));
      const location = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key
        .split('/')
        .map(encodeURIComponent)
        .join('/')}`;

      const uploadResult: S3UploadResult = {
        Location: location,
        ETag: result.ETag,
        Bucket: this.bucket,
        Key: key,
      };

      return uploadResult;
    } catch (err) {
      this.logger.warn('file could not be uploaded to S3 bucket');
      throw err;
    }
  }

  async deleteUploadFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(params));
    } catch (err) {
      throw new HttpException('Cannot delete image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getImageStreamFromS3(key: string): Promise<string | null> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const signedUrl = await getSignedUrl(this.s3, new GetObjectCommand(params), {
        expiresIn: 3600,
      });
      return signedUrl;
    } catch (err) {
      await this.logger.error('Error getting image stream from S3', err);
      return null;
    }
  }
}
