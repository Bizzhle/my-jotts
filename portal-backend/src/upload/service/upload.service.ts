import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { EnvVars } from '../../envvars';

@Injectable()
export class UploadService {
  private region: string;
  private s3: AWS.S3;

  constructor(private configService: ConfigService<EnvVars>) {
    this.region = configService.getOrThrow<string>('AWS_S3_REGION');
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async upload(file) {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    if (!bucket) {
      throw new Error('AWS S3 bucket name is not configured');
    }

    try {
      const uploadedFile = await this.s3_upload(
        file.buffer,
        bucket,
        file.originalname,
        file.mimetype,
      );
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  private async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.region,
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response.Location;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }
}
