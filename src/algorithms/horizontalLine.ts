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

// 4x4 hybrid matrix: scattered dots in lights, horizontal lines in darks
// Light areas trigger high thresholds first -> scattered dots (alternating 255s)
// Dark areas fill in low thresholds -> continuous horizontal lines
export const DEFAULT_HORIZONTAL_MATRIX = [
  [192, 176, 184, 168],  // Row 0 - lightest, solid line
  [144, 128, 136, 120],  // Row 1 - light, solid line
  [ 96,  80,  88, 255],  // Row 2 - mid, line with gap for dots
  [ 48,  32,  40,  24],  // Row 3 - darkest, solid line
];

// Current matrix state (can be modified by MatrixEditor)
let currentMatrix = DEFAULT_HORIZONTAL_MATRIX.map(row => [...row]);

export const setHorizontalMatrix = (matrix: number[][]) => {
  currentMatrix = matrix.map(row => [...row]);
};

export const getHorizontalMatrix = () => {
  return currentMatrix.map(row => [...row]);
};

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
      const matrixValue = currentMatrix[y % 4][x % 4];
      
      // Pixel is "on" (foreground) if grayscale > adjusted threshold
      const adjustedThreshold = matrixValue + thresholdOffset;
      
      result[idx] = pixel > adjustedThreshold;
    }
  }

  return result;
};
