import { floydSteinberg } from './floydSteinberg';
import { atkinson } from './atkinson';
import { ordered } from './ordered';
import { stucki } from './stucki';
import { horizontalLine } from './horizontalLine';
import { DitherAlgorithm, DitherFunction } from './types';

export { floydSteinberg, atkinson, ordered, stucki, horizontalLine };
export type { DitherAlgorithm, DitherFunction, DitherOptions } from './types';

export const algorithms: Record<DitherAlgorithm, DitherFunction> = {
  'floyd-steinberg': floydSteinberg,
  'atkinson': atkinson,
  'ordered': ordered,
  'stucki': stucki,
  'horizontal-line': horizontalLine,
};

export const algorithmNames: Record<DitherAlgorithm, string> = {
  'floyd-steinberg': 'Floyd-Steinberg',
  'atkinson': 'Atkinson',
  'ordered': 'Ordered (Bayer)',
  'stucki': 'Stucki',
  'horizontal-line': 'Horizontal Line',
};

export const algorithmDescriptions: Record<DitherAlgorithm, string> = {
  'floyd-steinberg': 'Classic error diffusion with smooth gradients',
  'atkinson': 'Mac-style dithering with higher contrast',
  'ordered': 'Pattern-based with regular grid effect',
  'stucki': 'Improved error diffusion with less noise',
  'horizontal-line': 'Halftone with horizontal lines and dots',
};
