// Encode the square ImageGen master for the closed productivity-card preview.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { encodeSquareWebpVariants } from '../lib/webp-variants.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const master = readFileSync(projectPath('design/originals/services/productivity-crm-preview.png'));
const browser = await Browser.launch();
try {
  const page = await browser.newPage();
  const variants = await page.eval(encodeSquareWebpVariants, master.toString('base64'));
  for (const { size, data } of variants) {
    const bytes = Buffer.from(data, 'base64');
    const name = `productivity-imagen-${size}.webp`;
    writeFileSync(projectPath('app/static/images/services', name), bytes);
    console.log(`${name}: ${Math.round(bytes.length / 1024)} KB`);
  }
  await page.close();
} finally { await browser.close(); }
