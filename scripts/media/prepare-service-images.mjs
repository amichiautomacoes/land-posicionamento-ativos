// Export the ImageGen masters without changing their composition or aspect ratio.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { encodeSquareWebpVariants } from '../lib/webp-variants.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const destination = projectPath('app/static/images/services');
const report = projectPath('reports/qa/services-imagen');
mkdirSync(report, { recursive: true });
const browser = await Browser.launch();
const exports = [];
try {
  const page = await browser.newPage();
  for (const name of ['google-presence', 'digital-marketing', 'sales-automation']) {
    const master = readFileSync(projectPath(`design/originals/services/${name}-imagen-square-responsive.png`));
    const variants = await page.eval(encodeSquareWebpVariants, master.toString('base64'));
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
