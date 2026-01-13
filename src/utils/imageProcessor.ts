export interface ProcessedImage {
  grayscale: number[];
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Load an image file and return an HTMLImageElement
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Process an image: resize based on scale (pixel size) and convert to grayscale
 * Scale represents the size of each dithered pixel (1 = 1:1, 2 = 2x2 pixels, etc.)
 */
export const processImage = (
  img: HTMLImageElement,
  scale: number,
  maxDimension: number = 800
): ProcessedImage => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Calculate dimensions - divide by scale to get fewer, larger pixels
  let width = Math.round(img.width / scale);
  let height = Math.round(img.height / scale);
  
  // Constrain to max dimension while maintaining aspect ratio
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  
  // Ensure minimum size
  width = Math.max(width, 10);
  height = Math.max(height, 10);
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw image to canvas
  ctx.drawImage(img, 0, 0, width, height);
  
  // Get pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Convert to grayscale using luminance formula
  const grayscale: number[] = new Array(width * height);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luminance formula (perceived brightness)
    grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  
  return {
    grayscale,
    width,
    height,
    originalWidth: img.width,
    originalHeight: img.height,
  };
};

/**
 * Render a binary dither result to a canvas for preview
 */
export const renderToCanvas = (
  canvas: HTMLCanvasElement,
  dithered: boolean[],
  width: number,
  height: number,
  foregroundColor: string,
  backgroundColor: string
): void => {
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = width;
  canvas.height = height;
  
  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Draw foreground pixels
  ctx.fillStyle = foregroundColor;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (dithered[y * width + x]) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
};
