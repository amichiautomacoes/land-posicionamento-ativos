// Export the approved transparent master with alpha and its original proportions.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const master = projectPath('design/originals/brand/ativos-negocios-locais-metalico-transparent.png');
const destination = projectPath('app/static/images/brand/ativos-negocios-locais-metalico.webp');
const iconDirectory = projectPath('app/static/images/brand');
const background = readFileSync(projectPath('app/static/css/tokens.css'), 'utf8').match(/--brand-background:\s*(#[0-9a-f]+)/i)?.[1];
if (!background) throw new Error('Brand background token unavailable');
const output = projectPath('reports/qa/metallic-logo');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
try {
  const page = await browser.newPage();
  try {
    const result = await page.eval(async ({ data, background }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const source = document.createElement('canvas');
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const context = source.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, source.width, source.height).data;
      let left = source.width, top = source.height, right = 0, bottom = 0, transparent = 0;
      for (let y = 0; y < source.height; y++) {
        for (let x = 0; x < source.width; x++) {
          const alpha = pixels[(y * source.width + x) * 4 + 3];
          if (alpha === 0) transparent++;
          // Ignore nearly invisible outer pixels when measuring the crop, retaining a safety margin.
          if (alpha < 32) continue;
          left = Math.min(left, x); top = Math.min(top, y);
          right = Math.max(right, x); bottom = Math.max(bottom, y);
        }
      }
      if (transparent < source.width * source.height * .2) throw new Error('The master must have a transparent background');
      const padding = 12;
      left = Math.max(0, left - padding); top = Math.max(0, top - padding);
      right = Math.min(source.width - 1, right + padding); bottom = Math.min(source.height - 1, bottom + padding);
      const cropWidth = right - left + 1, cropHeight = bottom - top + 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(960, cropWidth);
      canvas.height = Math.round(canvas.width * cropHeight / cropWidth);
      const resized = canvas.getContext('2d');
      resized.imageSmoothingQuality = 'high';
      resized.drawImage(image, left, top, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
      const encoded = canvas.toDataURL('image/webp', .94);
      if (!encoded.startsWith('data:image/webp;')) throw new Error('WebP encoder unavailable');
      // The source has the symbol at left and lettering at right. Measure only the symbol.
      const symbolBoundary = Math.floor(source.width * .345);
      let symbolLeft = source.width, symbolTop = source.height, symbolRight = 0, symbolBottom = 0;
      for (let y = 0; y < source.height; y++) {
        for (let x = 0; x < symbolBoundary; x++) {
          if (pixels[(y * source.width + x) * 4 + 3] < 32) continue;
          symbolLeft = Math.min(symbolLeft, x); symbolTop = Math.min(symbolTop, y);
          symbolRight = Math.max(symbolRight, x); symbolBottom = Math.max(symbolBottom, y);
        }
      }
      const symbolWidth = symbolRight - symbolLeft + 1, symbolHeight = symbolBottom - symbolTop + 1;
      if (symbolWidth <= 0 || symbolHeight <= 0) throw new Error('Brand symbol unavailable');
      const icons = [16, 32, 180].map(size => {
        const icon = document.createElement('canvas');
        icon.width = icon.height = size;
        const drawing = icon.getContext('2d');
        drawing.fillStyle = background;
        drawing.fillRect(0, 0, size, size);
        drawing.imageSmoothingQuality = 'high';
        const inset = size === 180 ? 18 : 1;
        const scale = (size - inset * 2) / Math.max(symbolWidth, symbolHeight);
        const width = symbolWidth * scale, height = symbolHeight * scale;
        drawing.drawImage(image, symbolLeft, symbolTop, symbolWidth, symbolHeight, (size - width) / 2, (size - height) / 2, width, height);
        return { size, data: icon.toDataURL('image/png').split(',')[1] };
      });
      return {
        source: { width: source.width, height: source.height },
        crop: { left, top, width: cropWidth, height: cropHeight },
        width: canvas.width, height: canvas.height,
        transparentFraction: transparent / (source.width * source.height),
        data: encoded.split(',')[1],
        symbolCrop: { left: symbolLeft, top: symbolTop, width: symbolWidth, height: symbolHeight },
        icons,
      };
    }, { data: readFileSync(master).toString('base64'), background });
    const bytes = Buffer.from(result.data, 'base64');
    writeFileSync(destination, bytes);
    const { data, icons, ...metadata } = result;
    const exportedIcons = icons.map(icon => {
      const filename = icon.size === 180 ? 'ativos-negocios-locais-metalico-touch-180.png' : `ativos-negocios-locais-metalico-favicon-${icon.size}.png`;
      const iconBytes = Buffer.from(icon.data, 'base64');
      writeFileSync(resolve(iconDirectory, filename), iconBytes);
      return { filename, size: icon.size, bytes: iconBytes.length };
    });
    const exports = { ...metadata, bytes: bytes.length, icons: exportedIcons };
    writeFileSync(resolve(output, 'export.json'), JSON.stringify(exports, null, 2));
    console.log(JSON.stringify(exports));
  } finally { await page.close(); }
} finally { await browser.close(); }
