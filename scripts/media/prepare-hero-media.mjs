import { getExecutionContext } from '../lib/execution-context.mjs';
// Publish the supplied hero videos and derive matching posters with browser Canvas.
import { Browser } from '../lib/browser.mjs';
import { projectPath } from '../lib/project-paths.mjs';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { url, output: report } = getExecutionContext('reports/qa/hero-full/media');
const assets = [
  { name: 'desktop', original: 'hero_desktop.mp4' },
  { name: 'mobile', original: 'hero_cel.mp4' },
];
mkdirSync(report, { recursive: true });
for (const asset of assets) {
  copyFileSync(projectPath('design/originals/hero', asset.original), projectPath(`app/static/videos/hero/${asset.name}.mp4`));
}

const browser = await Browser.launch();
const metadata = [];
try {
  const page = await browser.newPage();
  // Same-origin helper without the landing's playback initializers.
  await page.goto(new URL('/static/css/tokens.css', url).href, { settleMs: 100 });
  for (const asset of assets) {
    const result = await page.eval(async source => {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = () => reject(new Error('Cannot decode ' + source));
        video.src = source;
        video.load();
      });
      const width = video.videoWidth, height = video.videoHeight, duration = video.duration;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const capture = async (time, maxWidth, quality) => {
        if (Math.abs(video.currentTime - time) > .001) await new Promise(resolve => {
          video.onseeked = resolve;
          video.currentTime = time;
        });
        canvas.width = Math.min(width, maxWidth);
        canvas.height = Math.round(canvas.width * height / width);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', quality).split(',')[1];
      };
      const times = [Math.min(.5, duration / 10), duration / 3, duration * 2 / 3, Math.max(0, duration - .1)];
      const poster = await capture(times[0], width, .86);
      const frames = [];
      for (const time of times) frames.push({ time, data: await capture(time, width > height ? 1280 : 540, .88) });
      video.removeAttribute('src');
      video.load();
      return { width, height, duration, poster, frames };
    }, new URL(`/static/videos/hero/${asset.name}.mp4?prepare=${Date.now()}`, url).href);
    writeFileSync(projectPath(`app/static/images/hero/${asset.name}-poster.jpg`), Buffer.from(result.poster, 'base64'));
    result.frames.forEach((frame, index) => writeFileSync(resolve(report, `${asset.name}-${index}.jpg`), Buffer.from(frame.data, 'base64')));
    metadata.push({ ...asset, width: result.width, height: result.height, duration: result.duration, sampleTimes: result.frames.map(frame => frame.time) });
    console.log(JSON.stringify(metadata.at(-1)));
  }
  await page.close();
  writeFileSync(resolve(report, 'metadata.json'), JSON.stringify(metadata, null, 2));
} finally { await browser.close(); }
