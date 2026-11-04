import { Browser, sleep } from './support/browser-env.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.argv[2] || 'http://127.0.0.1:5017/';
const output = resolve(root, process.argv[3] || 'reports/qa/browser');
assert.ok(output.startsWith(root + sep), 'Keep QA output inside this project');
mkdirSync(output, { recursive: true });

const browser = await Browser.launch();
const result = { viewports: [], interactions: [], reducedMotion: {}, noJavaScript: {} };

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 });
    try {
      await page.goto(url, { settleMs: 700 });
      await page.eval(async () => {
        await document.fonts.ready;
        document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      const metrics = await page.eval(() => ({
        width: innerWidth,
        overflow: document.documentElement.scrollWidth - innerWidth,
        mainHeadings: document.querySelectorAll('h1').length,
        brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
        brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map(link => link.hash).filter(hash => !document.getElementById(hash.slice(1))),
        fontLoaded: document.fonts.check('400 16px Inter') && document.fonts.check('600 32px "Space Grotesk"'),
        headingFont: getComputedStyle(document.querySelector('h1')).fontFamily,
        headingWeight: getComputedStyle(document.querySelector('h1')).fontWeight,
        background: getComputedStyle(document.body).backgroundColor,
        primary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim(),
        accent: getComputedStyle(document.documentElement).getPropertyValue('--brand-accent').trim(),
        focus: getComputedStyle(document.documentElement).getPropertyValue('--web-focus').trim(),
        videoSource: document.querySelector('.hero-video').currentSrc,
      }));
      assert.equal(metrics.overflow, 0, width + 'px horizontal overflow');
      assert.equal(metrics.mainHeadings, 1);
      assert.deepEqual(metrics.brokenImages, []);
      assert.deepEqual(metrics.brokenAnchors, []);
      assert.equal(metrics.fontLoaded, true);
      assert.equal(metrics.background, 'rgb(16, 27, 51)');
      assert.ok(metrics.headingFont.startsWith('"Space Grotesk"'));
      assert.equal(metrics.headingWeight, '600');
      assert.equal(metrics.primary, '#007fa8');
      assert.equal(metrics.accent, '#c7ff3d');
      assert.ok(metrics.videoSource.includes(width <= 1020 ? '/mobile.mp4' : '/desktop.mp4'));
      await page.screenshot({ path: resolve(output, width + '-fold.jpg'), quality: 88 });

      if (width <= 1020) {
        await page.eval(() => document.querySelector('.menu-toggle').click());
        assert.equal(await page.eval(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded')), 'true');
        await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        assert.equal(await page.eval(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded')), 'false');
        assert.equal(await page.eval(() => document.activeElement === document.querySelector('.menu-toggle')), true);
        await page.eval(() => {
          document.querySelector('.menu-toggle').click();
          document.querySelector('.nav-links a[href="#platform"]').click();
        });
        assert.equal(await page.eval(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded')), 'false');
        result.interactions.push(width + 'px: menu, Escape, focus return and close after navigation');
      }

      await page.eval(() => document.querySelector('.hero-actions .text-link').click());
      assert.equal(await page.eval(() => location.hash), '#capabilities');
      assert.equal(await page.eval(() => document.querySelector('#customers')), null);
      await page.eval(() => document.querySelector('.hero-video-toggle').click());
      await sleep(150);
      assert.equal(await page.eval(() => document.querySelector('.hero-video').paused), true);
      await page.eval(() => document.querySelector('.hero-video-toggle').click());
      await sleep(150);
      assert.equal(await page.eval(() => document.querySelector('.hero-video').paused), false);
      assert.deepEqual(page.consoleErrors, []);
      result.viewports.push(metrics);
      result.interactions.push(width + 'px: section link, removed testimonial, video controls and console');
    } finally {
      await page.close();
    }
  }

  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true, reducedMotion: true });
  try {
    await reduced.goto(url, { settleMs: 400 });
    result.reducedMotion = await reduced.eval(() => ({
      animations: document.getAnimations().length,
      videoPaused: document.querySelector('.hero-video').paused,
      titleOpacity: getComputedStyle(document.querySelector('h1')).opacity,
    }));
    assert.equal(result.reducedMotion.animations, 0);
    assert.equal(result.reducedMotion.videoPaused, true);
    assert.equal(result.reducedMotion.titleOpacity, '1');
  } finally {
    await reduced.close();
  }

  const noJavaScript = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await noJavaScript.send('Emulation.setScriptExecutionDisabled', { value: true });
    await noJavaScript.goto(url, { settleMs: 900 });
    result.noJavaScript = await noJavaScript.eval(() => ({
      navigationVisible: getComputedStyle(document.querySelector('.navigation-content')).display !== 'none',
      titleVisible: getComputedStyle(document.querySelector('h1')).opacity === '1',
      contactVisible: document.querySelector('#diagnostico').textContent.includes('Fale com a Ativos'),
      overflow: document.documentElement.scrollWidth - innerWidth,
    }));
    assert.equal(result.noJavaScript.navigationVisible, true);
    assert.equal(result.noJavaScript.titleVisible, true);
    assert.equal(result.noJavaScript.contactVisible, true);
    assert.equal(result.noJavaScript.overflow, 0);
  } finally {
    await noJavaScript.close();
  }

  writeFileSync(resolve(output, 'results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
