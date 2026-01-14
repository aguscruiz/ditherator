import { DitherAlgorithm, algorithmNames, algorithmDescriptions } from '../algorithms';
import './DitherControls.css';

interface DitherControlsProps {
  algorithm: DitherAlgorithm;
  threshold: number;
  scale: number;
  foregroundColor: string;
  backgroundColor: string;
  onAlgorithmChange: (algo: DitherAlgorithm) => void;
  onThresholdChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onForegroundColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  disabled: boolean;
}

const ALGORITHMS: DitherAlgorithm[] = ['ordered', 'floyd-steinberg', 'atkinson', 'stucki', 'horizontal-line'];

export const DitherControls = ({
  algorithm,
  threshold,
  scale,
  foregroundColor,
  backgroundColor,
  onAlgorithmChange,
  onThresholdChange,
  onScaleChange,
  onForegroundColorChange,
  onBackgroundColorChange,
  disabled,
}: DitherControlsProps) => {
  return (
    <div className="dither-controls">
      <div className="control-group">
        <label className="control-label">Algorithm</label>
        <div className="algorithm-grid">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo}
              className={`algorithm-button ${algorithm === algo ? 'active' : ''}`}
              onClick={() => onAlgorithmChange(algo)}
              title={algorithmDescriptions[algo]}
            >
              {algorithmNames[algo]}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">
          Threshold
          <span className="control-value">{threshold}</span>
        </label>
        <input
          type="range"
          min="1"
          max="255"
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
          disabled={disabled}
          className="control-slider"
        />
      </div>

      <div className="control-group">
        <label className="control-label">
          Scale
          <span className="control-value">{scale.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          disabled={disabled}
          className="control-slider"
        />
      </div>

      <div className="control-group colors-group">
        <label className="control-label">Colors</label>
        <div className="color-inputs">
          <div className="color-input">
            <label>Foreground</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => onForegroundColorChange(e.target.value)}
                disabled={disabled}
              />
              <span className="color-hex">{foregroundColor}</span>
            </div>
          </div>
          <div className="color-input">
            <label>Background</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                disabled={disabled}
              />
              <span className="color-hex">{backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className="swap-colors-button"
        onClick={() => {
          const temp = foregroundColor;
          onForegroundColorChange(backgroundColor);
          onBackgroundColorChange(temp);
        }}
        disabled={disabled}
        title="Swap colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
        Swap Colors
      </button>
    </div>
  );
};
