export type DitherAlgorithm = 'ordered' | 'horizontal-line';

export interface DitherOptions {
  threshold: number; // 0-255
  scale: number; // output resolution multiplier (0.1 - 2)
}

export type DitherFunction = (
  grayscale: number[],
  width: number,
  height: number,
  threshold: number
) => boolean[];
