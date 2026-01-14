import { useState, useEffect } from 'react';
import './MatrixEditor.css';

interface MatrixEditorProps {
  matrix: number[][];
  onChange: (matrix: number[][]) => void;
}

export const MatrixEditor = ({ matrix, onChange }: MatrixEditorProps) => {
  const [localMatrix, setLocalMatrix] = useState<number[][]>(
    matrix.map(row => [...row])
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);

  useEffect(() => {
    onChange(localMatrix);
  }, [localMatrix, onChange]);

  const handleCellClick = (row: number, col: number) => {
    const currentValue = localMatrix[row][col];
    const newMatrix = localMatrix.map(r => [...r]);
    
    // Toggle between 255 (gap) and a calculated line value
    if (currentValue === 255) {
      // Calculate appropriate line value based on row position (4x4 grid)
      const baseValue = Math.round(24 + (3 - row) * 48);
      newMatrix[row][col] = baseValue + Math.round((col - 1.5) * 8);
    } else {
      newMatrix[row][col] = 255;
    }
    
    setLocalMatrix(newMatrix);
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    const currentValue = localMatrix[row][col];
    setDragValue(currentValue === 255 ? 100 : 255);
    handleCellClick(row, col);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging && dragValue !== null) {
      const newMatrix = localMatrix.map(r => [...r]);
      if (dragValue === 255) {
        newMatrix[row][col] = 255;
      } else {
        const baseValue = Math.round(24 + (3 - row) * 48);
        newMatrix[row][col] = baseValue + Math.round((col - 1.5) * 8);
      }
      setLocalMatrix(newMatrix);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragValue(null);
  };

  const fillRowAsLine = (row: number) => {
    const newMatrix = localMatrix.map(r => [...r]);
    const baseValue = Math.round(24 + (3 - row) * 48);
    for (let col = 0; col < 4; col++) {
      newMatrix[row][col] = Math.round(baseValue + (col - 1.5) * 8);
    }
    setLocalMatrix(newMatrix);
  };

  const fillRowAsDots = (row: number) => {
    const newMatrix = localMatrix.map(r => [...r]);
    const baseValue = Math.round(128 + row * 24);
    for (let col = 0; col < 4; col++) {
      newMatrix[row][col] = col % 2 === 0 ? 255 : baseValue + col * 8;
    }
    setLocalMatrix(newMatrix);
  };

  const resetToDefault = () => {
    const defaultMatrix = [
      [160, 144, 152, 136],  // Row 0 - line (light areas)
      [255, 255, 255, 255],  // Row 1 - gap (always empty)
      [ 64,  48,  56,  40],  // Row 2 - line (dark areas)
      [255, 255, 255, 255],  // Row 3 - gap (always empty)
    ];
    setLocalMatrix(defaultMatrix);
  };

  return (
    <div className="matrix-editor-inline" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="matrix-editor-header">
        <span className="matrix-title">Pattern Matrix</span>
        <button className="reset-btn" onClick={resetToDefault} title="Reset to default">
          ↺
        </button>
      </div>

      <div className="matrix-grid-wrapper">
        <div className="matrix-grid">
          {localMatrix.map((row, rowIdx) => (
            <div key={rowIdx} className="matrix-row">
              {row.map((value, colIdx) => {
                const isGap = value === 255;
                
                return (
                  <div
                    key={colIdx}
                    className={`matrix-cell ${isGap ? 'gap' : 'filled'}`}
                    onMouseDown={() => handleCellMouseDown(rowIdx, colIdx)}
                    onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)}
                    title={`[${rowIdx},${colIdx}]: ${value}`}
                  />
                );
              })}
              <div className="row-btns">
                <button onClick={() => fillRowAsLine(rowIdx)} title="Fill row as line">―</button>
                <button onClick={() => fillRowAsDots(rowIdx)} title="Fill row as dots">∙∙</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="matrix-legend">
        <span><span className="dot filled"></span> Line</span>
        <span><span className="dot gap"></span> Gap</span>
      </div>
    </div>
  );
};
