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

// 4x4 hybrid matrix: alternating row, solid lines, blank row
export const DEFAULT_HORIZONTAL_MATRIX = [
  [255, 164, 255, 180],  // Row 0 - gap, line, gap, line
  [108, 116, 124, 132],  // Row 1 - all lines
  [ 60,  68,  76,  84],  // Row 2 - all lines
  [255, 255, 255, 255],  // Row 3 - all gaps
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
