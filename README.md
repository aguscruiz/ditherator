# Ditherator

Transform images into beautiful dithered SVG art.

## Features

- **Multiple Dithering Algorithms**
  - Floyd-Steinberg - Classic error diffusion with smooth gradients
  - Atkinson - Mac-style dithering with higher contrast
  - Ordered (Bayer) - Pattern-based with regular grid effect
  - Stucki - Improved error diffusion with less noise

- **Full Control**
  - Adjustable threshold for brightness control
  - Resolution scaling (10% - 200%)
  - Custom foreground and background colors
  - Live preview

- **SVG Output**
  - Download as optimized SVG file
  - Run-length encoding for smaller file sizes
  - Scalable vector output

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

## Usage

1. Drop an image onto the upload area (or click to browse)
2. Select a dithering algorithm
3. Adjust threshold, resolution, and colors to your liking
4. Click "Download SVG" to save your dithered artwork

## Tech Stack

- React 18
- TypeScript
- Vite
- Canvas API for image processing
