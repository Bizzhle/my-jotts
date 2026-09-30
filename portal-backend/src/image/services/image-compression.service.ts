import { Injectable } from '@nestjs/common';
import * as sharpModule from 'sharp';

const sharp = sharpModule as unknown as (input: Buffer) => sharpModule.Sharp;

export type ImageOutputFormat = 'webp' | 'jpeg';

export interface ImageCompressionOptions {
  format?: ImageOutputFormat;
  maxDimension?: number;
  quality?: number;
}

export interface CompressedImage {
  buffer: Buffer;
  mimeType: 'image/webp' | 'image/jpeg';
  extension: 'webp' | 'jpg';
}

@Injectable()
export class ImageCompressionService {
  async compress(input: Buffer, options: ImageCompressionOptions = {}): Promise<CompressedImage> {
    const format = options.format ?? 'webp';
    const maxDimension = options.maxDimension ?? 1920;
    const quality = options.quality ?? 82;

    if (!Number.isInteger(maxDimension) || maxDimension < 1) {
      throw new Error('maxDimension must be a positive integer');
    }
    if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
      throw new Error('quality must be an integer between 1 and 100');
    }

    let pipeline = sharp(input).rotate().resize({
      width: maxDimension,
      height: maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else {
      pipeline = pipeline.flatten({ background: '#ffffff' }).jpeg({ quality });
    }

    const buffer = await pipeline.toBuffer();

    return format === 'webp'
      ? { buffer, mimeType: 'image/webp', extension: 'webp' }
      : { buffer, mimeType: 'image/jpeg', extension: 'jpg' };
  }
}
