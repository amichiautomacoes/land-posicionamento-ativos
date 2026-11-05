// Export the square ImageGen adaptations used by closed benefit-card previews.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { encodeSquareWebpVariants } from '../lib/webp-variants.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const artwork = [
  ['benefit-visibility', 'benefit-visibility'],
  ['benefit-opportunities', 'benefit-opportunities'],
  ['sales-automation', 'sales-automation-benefit'],
];
const browser = await Browser.launch();
try {
  const page = await browser.newPage();
  for (const [source, destination] of artwork) {
    const master = readFileSync(projectPath(`design/originals/services/${source}-responsive.png`));
    const variants = await page.eval(encodeSquareWebpVariants, master.toString('base64'));
    for (const { size, data } of variants) {
      const bytes = Buffer.from(data, 'base64');
      const name = `${destination}-${size}.webp`;
      writeFileSync(projectPath('app/static/images/services', name), bytes);
      console.log(`${name}: ${Math.round(bytes.length / 1024)} KB`);
    }
  }
  await page.close();
} finally { await browser.close(); }
