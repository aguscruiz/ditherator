import { DitherFunction } from './types';

/**
 * Floyd-Steinberg Dithering Algorithm
 * Classic error diffusion algorithm that distributes quantization error to neighboring pixels.
 * 
 * Error distribution pattern:
 *       X   7/16
 * 3/16  5/16  1/16
 */
export const floydSteinberg: DitherFunction = (
  grayscale: number[],
  width: number,
  height: number,
  threshold: number
): boolean[] => {
  // Create a copy to work with (we'll modify values as we go)
  const pixels = [...grayscale];
  const result: boolean[] = new Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldPixel = pixels[idx];
      const newPixel = oldPixel < threshold ? 0 : 255;
      
      result[idx] = newPixel === 255;
      
      const error = oldPixel - newPixel;
      
      // Distribute error to neighboring pixels
      if (x + 1 < width) {
        pixels[idx + 1] += error * 7 / 16;
      }
      if (y + 1 < height) {
        if (x > 0) {
          pixels[(y + 1) * width + (x - 1)] += error * 3 / 16;
        }
        pixels[(y + 1) * width + x] += error * 5 / 16;
        if (x + 1 < width) {
          pixels[(y + 1) * width + (x + 1)] += error * 1 / 16;
        }
      }
    }
  }

  return result;
};
