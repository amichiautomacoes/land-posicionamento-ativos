// Encode the ImageGen master for the benefit thumbnail and expanded illustration.
import { Browser } from '../../tests/browser/support/browser-env.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const master = readFileSync(resolve(root, 'design/originals/services/productivity-imagen.png'));
const browser = await Browser.launch();
try {
  const page = await browser.newPage();
  const variants = await page.eval(async data => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    if (image.naturalWidth !== image.naturalHeight) throw new Error('Expected a square master');
    return [384, 768, 1254].map(size => {
      if (size > image.naturalWidth) throw new Error('Do not upscale the master');
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
  for (const { size, data } of variants) {
    const bytes = Buffer.from(data, 'base64');
    const name = `productivity-imagen-${size}.webp`;
    writeFileSync(resolve(root, 'app/static/images/services', name), bytes);
    console.log(`${name}: ${Math.round(bytes.length / 1024)} KB`);
  }
  await page.close();
} finally { await browser.close(); }
