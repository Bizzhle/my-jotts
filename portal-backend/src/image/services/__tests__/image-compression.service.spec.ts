import * as sharpModule from 'sharp';
import { ImageCompressionService } from '../image-compression.service';

const sharp = sharpModule as unknown as (
  input: Buffer | sharpModule.SharpOptions,
) => sharpModule.Sharp;

describe('ImageCompressionService', () => {
  let service: ImageCompressionService;

  beforeEach(() => {
    service = new ImageCompressionService();
  });

  it('resizes within the max dimension and converts to webp by default', async () => {
    const input = await sharp({
      create: { width: 1200, height: 600, channels: 3, background: '#ff0000' },
    })
      .png()
      .toBuffer();

    const result = await service.compress(input, { maxDimension: 800 });
    const metadata = await sharp(result.buffer).metadata();

    expect(result.mimeType).toBe('image/webp');
    expect(result.extension).toBe('webp');
    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(400);
  });

  it('converts to jpeg when requested', async () => {
    const input = await sharp({
      create: { width: 40, height: 20, channels: 3, background: '#00ff00' },
    })
      .png()
      .toBuffer();

    const result = await service.compress(input, { format: 'jpeg', quality: 70 });
    const metadata = await sharp(result.buffer).metadata();

    expect(result.mimeType).toBe('image/jpeg');
    expect(result.extension).toBe('jpg');
    expect(metadata.format).toBe('jpeg');
  });

  it('rejects invalid quality settings', async () => {
    const input = await sharp({
      create: { width: 1, height: 1, channels: 3, background: '#000000' },
    })
      .png()
      .toBuffer();

    await expect(service.compress(input, { quality: 101 })).rejects.toThrow(
      'quality must be an integer between 1 and 100',
    );
  });
});
