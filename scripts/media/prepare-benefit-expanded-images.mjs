// Encode the dedicated opened-state compositions for each responsive layout.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const artwork = ['benefit-visibility', 'benefit-opportunities', 'sales-automation-benefit', 'productivity-imagen'];
const options = process.argv.slice(2);
if (options.length && (options.length !== 2 || options[0] !== '--artwork' || !artwork.includes(options[1]))) {
  throw new Error(`Use --artwork with one of: ${artwork.join(', ')}`);
}
const selected = options[1];
const formats = { desktop: [3, 7], tablet: [1, 1], mobile: [3, 2] };
const output = projectPath('reports/qa/benefits-expanded-images', ...(selected ? [selected] : []));
mkdirSync(output, { recursive: true });
const exports = [];
const browser = await Browser.launch();
try {
  const page = await browser.newPage();
  for (const name of selected ? [selected] : artwork) {
    for (const [device, ratio] of Object.entries(formats)) {
      const sourceName = name === 'productivity-imagen' ? 'productivity-crm' : name;
      const source = `design/originals/services/${sourceName}-expanded-${device}.png`;
      const master = readFileSync(projectPath(source));
      const result = await page.eval(async ({ data, ratio, widths }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const aspect = ratio[0] / ratio[1];
        const cropWidth = Math.min(image.naturalWidth, image.naturalHeight * aspect);
        const cropHeight = cropWidth / aspect;
        const left = (image.naturalWidth - cropWidth) / 2;
        const top = (image.naturalHeight - cropHeight) / 2;
        const variants = widths.map(width => {
          if (width > cropWidth + 1) throw new Error(`Master too small for ${width}px: ${image.naturalWidth}x${image.naturalHeight}`);
          const height = Math.round(width / aspect);
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const drawing = canvas.getContext('2d');
          drawing.imageSmoothingQuality = 'high';
          drawing.drawImage(image, left, top, cropWidth, cropHeight, 0, 0, width, height);
          const encoded = canvas.toDataURL('image/webp', .88);
          if (!encoded.startsWith('data:image/webp;')) throw new Error('WebP encoder unavailable');
          return { width, height, data: encoded.split(',')[1] };
        });
        return { sourceWidth: image.naturalWidth, sourceHeight: image.naturalHeight, crop: { left, top, width: cropWidth, height: cropHeight }, variants };
      }, { data: master.toString('base64'), ratio, widths: device === 'desktop' ? [320, 640] : [384, 768] });
      for (const { width, height, data } of result.variants) {
        const filename = `${name}-expanded-${device}-${width}.webp`;
        const bytes = Buffer.from(data, 'base64');
        writeFileSync(projectPath('app/static/images/services', filename), bytes);
        exports.push({ filename, width, height, bytes: bytes.length, source, sourceWidth: result.sourceWidth, sourceHeight: result.sourceHeight, crop: result.crop });
        console.log(`${filename}: ${width}x${height}, ${Math.round(bytes.length / 1024)} KB`);
      }
    }
  }
  writeFileSync(resolve(output, 'exports.json'), JSON.stringify(exports, null, 2));
  await page.close();
} finally { await browser.close(); }
