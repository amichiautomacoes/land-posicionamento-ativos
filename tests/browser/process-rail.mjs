import { Browser, sleep } from './support/browser-env.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.argv[2] || 'http://127.0.0.1:5017/';
const output = resolve(root, process.argv[3] || 'reports/qa/process-rail/browser');
assert.ok(output.startsWith(root + sep));
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};

const ready = async page => {
  await page.goto(url, { settleMs: 250 });
  await page.eval(async () => {
    await document.fonts.ready;
    const images = [...document.querySelectorAll('#platform img')];
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode()));
  });
};
const scrollToPhase = async (page, phase) => {
  await page.eval(phase => {
    const centers = [...document.querySelectorAll('[data-rail-step]')].map(step => {
      const box = step.getBoundingClientRect();
      return box.top + scrollY + box.height / 2;
    });
    const index = Math.floor(phase);
    const top = centers[index] + ((centers[index + 1] ?? centers[index]) - centers[index]) * (phase - index);
    window.scrollTo({ top: top - innerHeight / 2, behavior: 'instant' });
  }, phase);
  await sleep(100);
};
const state = page => page.eval(() => {
  const rail = document.querySelector('[data-process-rail]');
  const visual = document.querySelector('[data-rail-visual]');
  const imageWindow = document.querySelector('[data-rail-window]');
  const angle = element => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
  };
  return {
    enhanced: rail.hasAttribute('data-rail-ready'),
    active: rail.dataset.active,
    angle: angle(imageWindow),
    opacity: [...imageWindow.children].map(image => Number(getComputedStyle(image).opacity)),
    imageAngles: [...imageWindow.children].map(angle),
    accessibleImages: [...imageWindow.children].filter(image => image.getAttribute('aria-hidden') === 'false').length,
    visual: visual.getBoundingClientRect().toJSON(),
    copy: [...document.querySelectorAll('.process-rail-copy')].map(copy => copy.getBoundingClientRect().toJSON()),
    overflow: document.documentElement.scrollWidth - innerWidth,
    railVisible: getComputedStyle(document.querySelector('[data-rail-path]')).display !== 'none',
    progress: new DOMMatrix(getComputedStyle(document.querySelector('[data-rail-progress]')).transform).d,
  };
});
const sheet = async (frames, filename) => {
  const helper = await browser.newPage({ width: 1200, height: Math.ceil(frames.length / 4) * 450 });
  try {
    await helper.eval(frames => {
      document.body.style.cssText = 'margin:0;display:grid;grid-template-columns:repeat(4,300px);background:#101b33';
      document.body.innerHTML = frames.map(frame => `<img alt="" src="data:image/jpeg;base64,${frame}" style="display:block;width:300px;height:450px;object-fit:contain">`).join('');
      return Promise.all([...document.images].map(image => image.decode()));
    }, frames);
    await helper.screenshot({ path: resolve(output, filename), quality: 85 });
  } finally { await helper.close(); }
};

try {
  for (const [width, height] of [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 });
    try {
      await ready(page);
      const headings = await page.eval(() => [...document.querySelectorAll('.process-rail-copy h3')].map(heading => [...heading.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('')));
      assert.deepEqual(headings, ['Seja encontrado no Google.', 'Atraia mais clientes nas redes sociais', 'Transforme contatos em oportunidades.']);
      const headingsFit = await page.eval(() => [...document.querySelectorAll('.process-rail-copy h3')].every(heading => {
        const copy = heading.closest('.process-rail-copy').getBoundingClientRect();
        const box = heading.getBoundingClientRect();
        return heading.scrollWidth <= heading.clientWidth + 1 && box.bottom <= copy.bottom + 1;
      }));
      assert.ok(headingsFit, `${width}px service headings must remain readable inside their columns`);
      const snapshots = [];
      for (const phase of [0, .5, .9, 1, 1.5, 1.9, 2]) {
        await scrollToPhase(page, phase);
        const current = await state(page);
        assert.equal(current.enhanced, true);
        assert.equal(current.overflow, 0, `${width}px must not overflow at phase ${phase}`);
        assert.equal(current.railVisible, width >= 768);
        assert.equal(current.accessibleImages, 1);
        assert.ok(Math.abs(current.angle + current.imageAngles[0]) < .1, 'Images must counter-rotate to remain upright');
        if (Number.isInteger(phase)) {
          assert.equal(current.active, String(phase));
          assert.ok(Math.abs(current.angle - phase * 45) < .2);
          assert.ok(current.opacity[phase] > .99);
          assert.ok(current.opacity.slice(0, phase).every(value => value < .01));
        }
        if (phase === .9) assert.ok(current.opacity[0] > .45 && current.opacity[0] < .55, `${width}px crossfade must track scroll: ${current.opacity[0]}`);
        snapshots.push(current);
        if (Number.isInteger(phase)) await page.screenshot({ path: resolve(output, `${width}-step-${phase + 1}.jpg`), quality: 88 });
      }
      if (width >= 768) {
        assert.ok(Math.abs(snapshots[1].visual.top - snapshots[4].visual.top) < 1, 'Image column must stay pinned while the copy scrolls');
        assert.ok(snapshots.at(-1).progress > snapshots[0].progress, 'Rail must fill with scroll');
      }
      await scrollToPhase(page, 0);
      assert.equal((await state(page)).active, '0', 'Reverse scrolling must restore the first image');

      if ([1440, 390].includes(width)) {
        const frames = [];
        for (let index = 0; index <= 10; index++) {
          await scrollToPhase(page, index / 5);
          frames.push(await page.screenshot({ quality: 78 }));
        }
        await sheet(frames, `${width}-scroll-sheet.jpg`);
      }
      assert.deepEqual(page.consoleErrors, []);
      results[width] = { status: 'passed', states: snapshots };
      console.log(`${width}px: sticky layout, rotation, image sync, crossfade, reverse scroll and overflow passed`);
    } finally { await page.close(); }
  }

  for (const mode of ['reduced-motion', 'no-javascript']) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ width, height: 900, mobile: width < 600, reducedMotion: mode === 'reduced-motion' });
      try {
        if (mode === 'no-javascript') await page.send('Emulation.setScriptExecutionDisabled', { value: true });
        await ready(page);
        const fallback = await page.eval(() => ({
          enhanced: document.querySelector('[data-process-rail]').hasAttribute('data-rail-ready'),
          pairedImages: [...document.querySelectorAll('[data-rail-step]')].every(step => step.querySelector('img')?.naturalWidth > 0),
          overflow: document.documentElement.scrollWidth - innerWidth,
          hiddenImages: document.querySelectorAll('#platform figure[aria-hidden="true"]').length,
        }));
        assert.equal(fallback.enhanced, false);
        assert.equal(fallback.pairedImages, true);
        assert.equal(fallback.hiddenImages, 0);
        assert.equal(fallback.overflow, 0);
        await page.eval(() => document.querySelector('#platform').scrollIntoView({ behavior: 'instant' }));
        await page.screenshot({ path: resolve(output, `${width}-${mode}.jpg`), quality: 85, fullPage: false });
        results[`${mode}-${width}`] = fallback;
      } finally { await page.close(); }
    }
    console.log(`${mode}: all three services retain their own images and copy on desktop and mobile`);
  }

  const adaptive = await browser.newPage({ width: 1440, height: 900 });
  try {
    await ready(adaptive);
    await scrollToPhase(adaptive, 1);
    await adaptive.setViewport({ width: 390, height: 844, mobile: true });
    await sleep(150);
    await scrollToPhase(adaptive, 2);
    assert.equal((await state(adaptive)).active, '2');
    await adaptive.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await sleep(100);
    assert.equal(await adaptive.eval(() => document.querySelectorAll('[data-rail-step] > [data-rail-image]').length), 3);
    await adaptive.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await sleep(100);
    assert.equal(await adaptive.eval(() => document.querySelectorAll('[data-rail-window] > [data-rail-image]').length), 3);
    await scrollToPhase(adaptive, 1);
    assert.equal((await state(adaptive)).active, '1');
    assert.deepEqual(adaptive.consoleErrors, []);
    results.liveChanges = 'Viewport resize and reduced-motion preference changes preserve all three images';
    console.log('Resize and live reduced-motion changes: passed');
  } finally { await adaptive.close(); }

  const fragment = await browser.newPage({ width: 1440, height: 900 });
  try {
    await fragment.goto(`${url}#act`, { settleMs: 500 });
    const linked = await state(fragment);
    assert.equal(linked.active, '2', 'A direct anchor must select its matching image');
    assert.equal(await fragment.eval(() => location.hash), '#act');
    results.directAnchor = 'Direct link to the third solution selects the third image';
    console.log('Direct anchor: passed');
  } finally { await fragment.close(); }

  writeFileSync(resolve(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
