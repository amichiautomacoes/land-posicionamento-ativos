// Export the ImageGen masters without changing their composition or aspect ratio.
// Requires the same local browser tooling as tests/browser/process-rail.mjs.
import { Browser } from '../../tests/browser/support/browser-env.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const destination = resolve(root, 'app/static/images/services');
const report = resolve(root, 'reports/qa/services-imagen');
mkdirSync(report, { recursive: true });
const browser = await Browser.launch();
const exports = [];
try {
  const page = await browser.newPage();
  for (const name of ['google-presence', 'digital-marketing', 'sales-automation']) {
    const master = readFileSync(resolve(root, `design/originals/services/${name}-imagen-square.png`));
    const variants = await page.eval(async data => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      if (image.naturalWidth !== image.naturalHeight) throw new Error('Service masters must be square');
      return [384, 768, 1254].map(size => {
        if (size > image.naturalWidth) throw new Error('Do not upscale the service masters');
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const context = canvas.getContext('2d');
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, size, size);
        const encoded = canvas.toDataURL('image/webp', .86);
        if (!encoded.startsWith('data:image/webp;')) throw new Error('WebP encoder unavailable');
        return { size, data: encoded.split(',')[1] };
      });
    }, master.toString('base64'));
    for (const variant of variants) {
      const filename = `${name}-imagen-square-${variant.size}.webp`;
      const bytes = Buffer.from(variant.data, 'base64');
      writeFileSync(resolve(destination, filename), bytes);
      exports.push({ filename, width: variant.size, height: variant.size, bytes: bytes.length });
      console.log(`${filename}: ${Math.round(bytes.length / 1024)} KB`);
    }
  }
  await page.close();
  writeFileSync(resolve(report, 'exports.json'), JSON.stringify(exports, null, 2));
} finally {
  await browser.close();
}
