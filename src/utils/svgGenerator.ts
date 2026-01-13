export interface SVGOptions {
  foregroundColor: string;
  backgroundColor: string;
  pixelSize?: number; // Size of each pixel in the SVG (default: 1)
}

/**
 * Generate an optimized SVG from dithered binary data
 * Uses run-length encoding to group consecutive horizontal pixels
 * SVG is inverted: background pixels become vector shapes (useful for cutting/engraving)
 */
export const generateSVG = (
  dithered: boolean[],
  width: number,
  height: number,
  options: SVGOptions
): string => {
  const { foregroundColor, backgroundColor, pixelSize = 1 } = options;
  
  const svgWidth = width * pixelSize;
  const svgHeight = height * pixelSize;
  
  // Collect all rectangles using run-length encoding
  // Inverted: we draw where dithered is FALSE (background becomes vector shapes)
  const rects: string[] = [];
  
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      if (!dithered[y * width + x]) {
        // Start of a run of background pixels (inverted)
        const startX = x;
        while (x < width && !dithered[y * width + x]) {
          x++;
        }
        const runLength = x - startX;
        
        rects.push(
          `<rect x="${startX * pixelSize}" y="${y * pixelSize}" width="${runLength * pixelSize}" height="${pixelSize}"/>`
        );
      } else {
        x++;
      }
    }
  }
  
  // Build SVG with optimized structure (inverted colors)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="${foregroundColor}"/>
  <g fill="${backgroundColor}">
    ${rects.join('\n    ')}
  </g>
</svg>`;

  return svg;
};

/**
 * Trigger download of SVG content as a file
 */
export const downloadSVG = (svgContent: string, filename: string = 'dithered.svg'): void => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Get estimated file size of SVG content
 */
export const getEstimatedSize = (svgContent: string): string => {
  const bytes = new Blob([svgContent]).size;
  
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};
