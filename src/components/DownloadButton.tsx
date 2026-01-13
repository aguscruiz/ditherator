import { useMemo } from 'react';
import { generateSVG, downloadSVG, getEstimatedSize } from '../utils/svgGenerator';
import './DownloadButton.css';

interface DownloadButtonProps {
  dithered: boolean[] | null;
  width: number;
  height: number;
  foregroundColor: string;
  backgroundColor: string;
  scale: number;
  filename?: string;
}

export const DownloadButton = ({
  dithered,
  width,
  height,
  foregroundColor,
  backgroundColor,
  scale,
  filename = 'dithered.svg',
}: DownloadButtonProps) => {
  const svgContent = useMemo(() => {
    if (!dithered) return null;
    return generateSVG(dithered, width, height, {
      foregroundColor,
      backgroundColor,
      pixelSize: scale,
    });
  }, [dithered, width, height, foregroundColor, backgroundColor, scale]);

  const fileSize = useMemo(() => {
    if (!svgContent) return null;
    return getEstimatedSize(svgContent);
  }, [svgContent]);

  const handleDownload = () => {
    if (svgContent) {
      downloadSVG(svgContent, filename);
    }
  };

  return (
    <button
      className={`download-button ${!dithered ? 'disabled' : ''}`}
      onClick={handleDownload}
      disabled={!dithered}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span className="download-text">
        Download SVG
        {fileSize && <span className="file-size">({fileSize})</span>}
      </span>
    </button>
  );
};
