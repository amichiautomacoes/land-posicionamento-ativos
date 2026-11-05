// Resize the transparent ImageGen cutouts, preserving their alpha and proportions.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const destination = projectPath('app/static/images/channels');
const report = projectPath('reports/qa/channel-logos');
mkdirSync(destination, { recursive: true });
mkdirSync(report, { recursive: true });
const browser = await Browser.launch();
const exports = [];
try {
  const page = await browser.newPage();
  for (const name of ['google', 'instagram', 'whatsapp']) {
    const master = readFileSync(projectPath(`design/originals/channels/${name}-logo-transparent.png`));
    const result = await page.eval(async data => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const source = document.createElement('canvas');
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const context = source.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, source.width, source.height).data;
      let left = source.width, top = source.height, right = -1, bottom = -1, transparent = 0;
      for (let y = 0; y < source.height; y++) {
        for (let x = 0; x < source.width; x++) {
          const alpha = pixels[(y * source.width + x) * 4 + 3];
          if (alpha === 0) transparent++;
          if (alpha < 32) continue;
          left = Math.min(left, x); top = Math.min(top, y);
          right = Math.max(right, x); bottom = Math.max(bottom, y);
        }
      }
      if (transparent < source.width * source.height * .1 || right < left) throw new Error('Expected a transparent logo master');
      const cropWidth = right - left + 1, cropHeight = bottom - top + 1;
      const variants = [];
      for (const size of [64, 128, 192]) {
        if (size > Math.max(cropWidth, cropHeight)) throw new Error('Do not upscale the logo');
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const drawing = canvas.getContext('2d', { willReadFrequently: true });
        drawing.imageSmoothingQuality = 'high';
        const scale = size * .92 / Math.max(cropWidth, cropHeight);
        const width = cropWidth * scale, height = cropHeight * scale;
        drawing.drawImage(image, left, top, cropWidth, cropHeight, (size - width) / 2, (size - height) / 2, width, height);
        const encoded = canvas.toDataURL('image/webp', .96);
        if (!encoded.startsWith('data:image/webp;')) throw new Error('WebP encoder unavailable');
        const decoded = new Image();
        decoded.src = encoded;
        await decoded.decode();
        drawing.clearRect(0, 0, size, size);
        drawing.drawImage(decoded, 0, 0);
        const rgba = drawing.getImageData(0, 0, size, size).data;
        const corners = [0, size - 1, size * (size - 1), size * size - 1].map(index => rgba[index * 4 + 3]);
        if (corners.some(alpha => alpha !== 0)) throw new Error('WebP must preserve transparent corners');
        let clear = 0;
        for (let index = 3; index < rgba.length; index += 4) if (rgba[index] === 0) clear++;
        variants.push({ size, data: encoded.split(',')[1], transparentFraction: clear / (size * size), cornerAlpha: corners });
      }
      return { source: { width: source.width, height: source.height }, crop: { left, top, width: cropWidth, height: cropHeight }, variants };
    }, master.toString('base64'));
    for (const { size, data, ...alpha } of result.variants) {
      const filename = `${name}-logo-${size}.webp`;
      const bytes = Buffer.from(data, 'base64');
      writeFileSync(resolve(destination, filename), bytes);
      exports.push({ filename, width: size, height: size, bytes: bytes.length, ...alpha, source: result.source, crop: result.crop });
      console.log(`${filename}: ${bytes.length} bytes; transparent corners verified`);
    }
  }
  writeFileSync(resolve(report, 'exports.json'), JSON.stringify(exports, null, 2));
  await page.close();
} finally { await browser.close(); }
