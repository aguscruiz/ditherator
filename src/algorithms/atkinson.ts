import { DitherFunction } from './types';

/**
 * Atkinson Dithering Algorithm
 * Developed by Bill Atkinson at Apple. Creates higher contrast images.
 * Only diffuses 6/8 (75%) of the error, creating a more pronounced effect.
 * 
 * Error distribution pattern (each = 1/8):
 *       X   1   1
 *   1   1   1
 *       1
 */
export const atkinson: DitherFunction = (
  grayscale: number[],
  width: number,
  height: number,
  threshold: number
): boolean[] => {
  const pixels = [...grayscale];
  const result: boolean[] = new Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldPixel = pixels[idx];
      const newPixel = oldPixel < threshold ? 0 : 255;
      
      result[idx] = newPixel === 255;
      
      // Atkinson only diffuses 6/8 of the error (not 8/8)
      const error = (oldPixel - newPixel) / 8;
      
      // Right neighbors
      if (x + 1 < width) {
        pixels[idx + 1] += error;
      }
      if (x + 2 < width) {
        pixels[idx + 2] += error;
      }
      
      // Next row
      if (y + 1 < height) {
        if (x > 0) {
          pixels[(y + 1) * width + (x - 1)] += error;
        }
        pixels[(y + 1) * width + x] += error;
        if (x + 1 < width) {
          pixels[(y + 1) * width + (x + 1)] += error;
        }
      }
      
      // Two rows down
      if (y + 2 < height) {
        pixels[(y + 2) * width + x] += error;
      }
    }
  }

  return result;
};
