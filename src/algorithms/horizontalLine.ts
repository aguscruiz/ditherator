import { DitherFunction } from './types';

/**
 * Horizontal Line Dithering Algorithm
 * Creates a halftone effect with horizontal lines, dashes, and dots.
 * 
 * The matrix combines:
 * - Low horizontal variance in some positions (creates lines)
 * - Higher variance "break points" (creates dots and dashes)
 * This produces a newspaper/print halftone look with varied textures.
 */

// 8x8 hybrid matrix: scattered dots in lights, horizontal lines in darks
// Light areas trigger high thresholds first -> scattered dots (alternating 255s)
// Dark areas fill in low thresholds -> continuous horizontal lines
const HORIZONTAL_8X8 = [
  [255, 200, 255, 208, 255, 204, 255, 196],  // Row 0 - lightest, first dots appear
  [176, 255, 184, 255, 188, 255, 180, 255],  // Row 1 - light, more dots
  [255, 152, 255, 160, 255, 156, 255, 148],  // Row 2 - light-mid, dots
  [128, 255, 136, 255, 140, 255, 132, 255],  // Row 3 - mid, dots starting to connect
  [104, 106, 108, 110, 110, 108, 106, 104],  // Row 4 - mid-dark, forming lines
  [ 78,  80,  82,  84,  84,  82,  80,  78],  // Row 5 - dark, solid line
  [ 52,  54,  56,  58,  58,  56,  54,  52],  // Row 6 - darker, solid line
  [ 26,  28,  30,  32,  32,  30,  28,  26],  // Row 7 - darkest, solid line
];

export const horizontalLine: DitherFunction = (
  grayscale: number[],
  width: number,
  height: number,
  threshold: number
): boolean[] => {
  const result: boolean[] = new Array(width * height);
  
  // Threshold controls overall brightness/density
  // Offset shifts all matrix values up or down
  const thresholdOffset = (threshold - 128) * 0.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixel = grayscale[idx];
      
      // Get matrix value - rows have similar values = horizontal lines
      const matrixValue = HORIZONTAL_8X8[y % 8][x % 8];
      
      // Pixel is "on" (foreground) if grayscale > adjusted threshold
      const adjustedThreshold = matrixValue + thresholdOffset;
      
      result[idx] = pixel > adjustedThreshold;
    }
  }

  return result;
};
