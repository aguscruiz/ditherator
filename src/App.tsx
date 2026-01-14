import { useState, useCallback, useEffect } from 'react';
import { ImageUploader, DitherControls, PreviewCanvas, DownloadButton } from './components';
import { loadImage, processImage, ProcessedImage } from './utils/imageProcessor';
import { algorithms, DitherAlgorithm } from './algorithms';
import './App.css';

function App() {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [dithered, setDithered] = useState<boolean[] | null>(null);
  const [algorithm, setAlgorithm] = useState<DitherAlgorithm>('ordered');
  const [threshold, setThreshold] = useState(200);
  const [scale, setScale] = useState(1);
  const [foregroundColor, setForegroundColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [filename, setFilename] = useState('dithered.svg');

  // Process uploaded image
  const handleImageLoad = useCallback(async (file: File) => {
    try {
      const img = await loadImage(file);
      setSourceImage(img);
      setFilename(file.name.replace(/\.[^/.]+$/, '') + '-dithered.svg');
      
      const processed = processImage(img, scale);
      setProcessedImage(processed);
    } catch (error) {image.png
      console.error('Error loading image:', error);
    }
  }, [scale]);

  // Re-process when scale changes
  useEffect(() => {
    if (sourceImage) {
      const processed = processImage(sourceImage, scale);
      setProcessedImage(processed);
    }
  }, [sourceImage, scale]);

  // Apply dithering when image or settings change
  useEffect(() => {
    if (!processedImage) {
      setDithered(null);
      return;
    }

    const ditherFn = algorithms[algorithm];
    const result = ditherFn(
      processedImage.grayscale,
      processedImage.width,
      processedImage.height,
      threshold
    );
    setDithered(result);
  }, [processedImage, algorithm, threshold]);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">▦</span>
          <h1>Ditherator</h1>
        </div>
        <p className="tagline">Transform images into dithered SVG art</p>
      </header>

      <main className="main">
        <aside className="sidebar">
          <ImageUploader 
            onImageLoad={handleImageLoad} 
            hasImage={!!processedImage} 
          />
          
          <DitherControls
            algorithm={algorithm}
            threshold={threshold}
            scale={scale}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            onAlgorithmChange={setAlgorithm}
            onThresholdChange={setThreshold}
            onScaleChange={setScale}
            onForegroundColorChange={setForegroundColor}
            onBackgroundColorChange={setBackgroundColor}
            disabled={!processedImage}
          />

          <DownloadButton
            dithered={dithered}
            width={processedImage?.width ?? 0}
            height={processedImage?.height ?? 0}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            scale={scale}
            filename={filename}
          />
        </aside>

        <section className="preview-area">
          <PreviewCanvas
            dithered={dithered}
            width={processedImage?.width ?? 0}
            height={processedImage?.height ?? 0}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            scale={scale}
          />
        </section>
      </main>

      <footer className="footer">
        <p>
          Made with <span className="heart">♥</span> by <a href="https://github.com/aguscruiz" target="_blank" rel="noopener noreferrer">Agustin Ruiz</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
