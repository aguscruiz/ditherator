import { ordered } from './ordered';
import { horizontalLine, setHorizontalMatrix, getHorizontalMatrix, DEFAULT_HORIZONTAL_MATRIX } from './horizontalLine';
import { DitherAlgorithm, DitherFunction } from './types';

export { ordered, horizontalLine, setHorizontalMatrix, getHorizontalMatrix, DEFAULT_HORIZONTAL_MATRIX };
export type { DitherAlgorithm, DitherFunction, DitherOptions } from './types';

export const algorithms: Record<DitherAlgorithm, DitherFunction> = {
  'ordered': ordered,
  'horizontal-line': horizontalLine,
};

export const algorithmNames: Record<DitherAlgorithm, string> = {
  'ordered': 'Ordered (Bayer)',
  'horizontal-line': 'Horizontal Line',
};

export const algorithmDescriptions: Record<DitherAlgorithm, string> = {
  'ordered': 'Pattern-based with regular grid effect',
  'horizontal-line': 'Halftone with horizontal lines and dots',
};
