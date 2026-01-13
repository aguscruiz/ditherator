import { useCallback, useState } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageLoad: (file: File) => void;
  hasImage: boolean;
}

export const ImageUploader = ({ onImageLoad, hasImage }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      onImageLoad(file);
    }
  }, [onImageLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFile(file);
      }
    };
    input.click();
  }, [handleFile]);

  return (
    <div
      className={`image-uploader ${isDragging ? 'dragging' : ''} ${hasImage ? 'has-image' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="upload-content">
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="upload-text">
          {hasImage ? 'Drop new image or click to replace' : 'Drop image here or click to upload'}
        </p>
        <p className="upload-hint">PNG, JPG, GIF, WebP</p>
      </div>
    </div>
  );
};
