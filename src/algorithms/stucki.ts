import { DitherFunction } from './types';

/**
 * Stucki Dithering Algorithm
 * An improved error diffusion algorithm with a larger distribution kernel.
 * Produces smoother gradients than Floyd-Steinberg with less noise.
 * 
 * Error distribution pattern (divisor = 42):
 *             X   8   4
 *   2   4   8   4   2
 *   1   2   4   2   1
 */
export const stucki: DitherFunction = (
  grayscale: number[],
  width: number,
  height: number,
  threshold: number
): boolean[] => {
  const pixels = [...grayscale];
  const result: boolean[] = new Array(width * height);
  const divisor = 42;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldPixel = pixels[idx];
      const newPixel = oldPixel < threshold ? 0 : 255;
      
      result[idx] = newPixel === 255;
      
      const error = oldPixel - newPixel;
      
      // Current row (right side)
      if (x + 1 < width) {
        pixels[idx + 1] += error * 8 / divisor;
      }
      if (x + 2 < width) {
        pixels[idx + 2] += error * 4 / divisor;
      }
      
      // Next row
      if (y + 1 < height) {
        const nextRow = (y + 1) * width;
        if (x >= 2) {
          pixels[nextRow + (x - 2)] += error * 2 / divisor;
        }
        if (x >= 1) {
          pixels[nextRow + (x - 1)] += error * 4 / divisor;
        }
        pixels[nextRow + x] += error * 8 / divisor;
        if (x + 1 < width) {
          pixels[nextRow + (x + 1)] += error * 4 / divisor;
        }
        if (x + 2 < width) {
          pixels[nextRow + (x + 2)] += error * 2 / divisor;
        }
      }
      
      // Two rows down
      if (y + 2 < height) {
        const twoRowsDown = (y + 2) * width;
        if (x >= 2) {
          pixels[twoRowsDown + (x - 2)] += error * 1 / divisor;
        }
        if (x >= 1) {
          pixels[twoRowsDown + (x - 1)] += error * 2 / divisor;
        }
        pixels[twoRowsDown + x] += error * 4 / divisor;
        if (x + 1 < width) {
          pixels[twoRowsDown + (x + 1)] += error * 2 / divisor;
        }
        if (x + 2 < width) {
          pixels[twoRowsDown + (x + 2)] += error * 1 / divisor;
        }
      }
    }
  }

  return result;
};
