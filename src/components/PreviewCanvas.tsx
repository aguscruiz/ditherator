import { useRef, useEffect } from 'react';
import { renderToCanvas } from '../utils/imageProcessor';
import './PreviewCanvas.css';

interface PreviewCanvasProps {
  dithered: boolean[] | null;
  width: number;
  height: number;
  foregroundColor: string;
  backgroundColor: string;
  scale: number;
}

export const PreviewCanvas = ({
  dithered,
  width,
  height,
  foregroundColor,
  backgroundColor,
  scale,
}: PreviewCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !dithered) return;
    
    renderToCanvas(
      canvasRef.current,
      dithered,
      width,
      height,
      foregroundColor,
      backgroundColor
    );
  }, [dithered, width, height, foregroundColor, backgroundColor]);

  // Calculate display size (scale up for chunky pixel effect)
  const displayWidth = width * scale;
  const displayHeight = height * scale;

  if (!dithered) {
    return (
      <div className="preview-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p>Upload an image to see the dithered preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <canvas
        ref={canvasRef}
        className="preview-canvas"
        style={{
          width: `${Math.min(displayWidth, 800)}px`,
          height: `${Math.min(displayHeight, 800 * (height / width))}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          imageRendering: 'pixelated',
        }}
      />
      <div className="preview-info">
        {displayWidth} × {displayHeight} px ({scale}x)
      </div>
    </div>
  );
};
