import { DitherFunction } from './types';

/**
 * Ordered (Bayer) Dithering Algorithm
 * Uses a threshold matrix to create a regular pattern.
 * Creates a distinctive grid-like halftone effect.
 * 
 * 4x4 Bayer matrix (normalized to 0-255 range):
 */
const BAYER_4X4 = [
  [  0, 128,  32, 160],
  [192,  64, 224,  96],
  [ 48, 176,  16, 144],
  [240, 112, 208,  80]
];

export const ordered: DitherFunction = (
  grayscale: number[],
  width: number,
  height: number,
  threshold: number
): boolean[] => {
  const result: boolean[] = new Array(width * height);
  
  // Adjust threshold influence (threshold controls overall brightness)
  const thresholdOffset = (threshold - 128) * 0.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixel = grayscale[idx];
      
      // Get the Bayer matrix value for this position
      const bayerValue = BAYER_4X4[y % 4][x % 4];
      
      // Apply threshold with Bayer matrix offset
      const adjustedThreshold = bayerValue + thresholdOffset;
      
      result[idx] = pixel > adjustedThreshold;
    }
  }

  return result;
};
