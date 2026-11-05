import { Browser, sleep } from './support/browser-env.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.argv[2] || 'http://127.0.0.1:5017/';
const output = resolve(root, process.argv[3] || 'reports/qa/horizontal-journey');
assert.ok(output.startsWith(root + sep));
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};
const ready = async page => {
  await page.send('Page.bringToFront');
  await page.goto(url, { settleMs: 200 });
  await page.eval(async () => {
    await document.fonts.ready;
    document.querySelector('#capabilities').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await sleep(400);
};
const state = page => page.eval(() => {
  const section = document.querySelector('#capabilities');
  const viewport = section.querySelector('[data-journey-scroll]');
  const box = viewport.getBoundingClientRect();
  return {
    overflow: document.documentElement.scrollWidth - innerWidth,
    scroll: viewport.scrollLeft,
    maximum: viewport.scrollWidth - viewport.clientWidth,
    box: box.toJSON(),
    tabbable: viewport.tabIndex,
    navigationHidden: section.querySelector('[data-journey-navigation]').hidden,
    previousDisabled: section.querySelector('[data-journey-previous]').disabled,
    nextDisabled: section.querySelector('[data-journey-next]').disabled,
    position: section.querySelector('[data-journey-position]').textContent,
    motion: section.querySelector('[data-customer-journey]').dataset.motion,
    motionLabel: section.querySelector('[data-journey-motion-toggle]').getAttribute('aria-label'),
    documentHidden: document.hidden,
    journeyBox: section.querySelector('[data-customer-journey]').getBoundingClientRect().toJSON(),
    motionHidden: section.querySelector('[data-journey-motion-toggle]').hidden,
    packets: [...section.querySelectorAll('.journey-packet')].map(packet => ({
      display: getComputedStyle(packet).display,
      playState: getComputedStyle(packet).animationPlayState,
    })),
    steps: [...section.querySelectorAll('[data-journey-step]')].map(step => ({
      title: step.querySelector('h3').textContent,
      box: step.getBoundingClientRect().toJSON(),
      titleBox: step.querySelector('h3').getBoundingClientRect().toJSON(),
      copyBox: step.querySelector('.journey-description').getBoundingClientRect().toJSON(),
    })),
  };
});
const capture = async (page, name) => {
  const clip = await page.eval(() => {
    const box = document.querySelector('#capabilities').getBoundingClientRect();
    return { x: 0, y: box.top + scrollY, width: innerWidth, height: Math.ceil(box.height), scale: 1 };
  });
  const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, captureBeyondViewport: true, clip });
  writeFileSync(resolve(output, name), Buffer.from(data, 'base64'));
  // Chrome temporarily expands the viewport for captureBeyondViewport. Let the
  // intersection observer see the restored viewport before checking motion.
  await sleep(150);
};
const key = async (page, key, windowsVirtualKeyCode) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode });
  await sleep(100);
};
try {
  for (const [width, height] of [[1440, 1000], [1024, 1000], [768, 1024], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 });
    try {
      await ready(page);
      const initial = await state(page);
      assert.equal(initial.overflow, 0, 'The page must not overflow horizontally');
      assert.deepEqual(initial.steps.map(step => step.title), ['Descoberta', 'Atendimento', 'Acompanhamento']);
      initial.steps.forEach(step => {
        assert.ok(Math.abs(step.box.top - initial.steps[0].box.top) < 1, 'All steps stay in one horizontal row');
        assert.ok(step.titleBox.left >= step.box.left && step.titleBox.right <= step.box.right + 1);
        assert.ok(step.copyBox.right <= step.box.right + 1 && step.copyBox.bottom <= step.box.bottom + 1);
      });
      assert.equal(initial.navigationHidden, initial.maximum <= 1);
      assert.equal(initial.motion, 'playing');
      await page.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      const paused = await state(page);
      assert.equal(paused.motion, 'paused');
      assert.equal(paused.motionLabel, 'Retomar movimento');
      assert.ok(paused.packets.every(packet => packet.playState === 'paused'));
      await page.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      assert.equal((await state(page)).motion, 'playing');
      await page.eval(() => scrollTo({ top: 0, behavior: 'instant' }));
      await sleep(100);
      assert.equal((await state(page)).motion, 'paused', 'Offscreen motion must pause');
      await page.eval(() => document.querySelector('#capabilities').scrollIntoView({ behavior: 'instant', block: 'start' }));
      await sleep(100);
      assert.equal((await state(page)).motion, 'playing');
      // Check intersection-dependent behavior before captureBeyondViewport,
      // which can leave Chrome's observer using the temporary capture viewport.
      await capture(page, `${width}-initial.jpg`);

      if (initial.maximum > 1) {
        assert.equal(initial.tabbable, 0);
        assert.equal(initial.position, 'Etapa 1 de 3');
        assert.equal(initial.previousDisabled, true);
        await page.eval(() => document.querySelector('[data-journey-next]').click());
        await sleep(500);
        const middle = await state(page);
        assert.ok(middle.scroll > 0);
        assert.equal(middle.position, 'Etapa 2 de 3');
        await page.eval(() => document.querySelector('[data-journey-scroll]').focus({ preventScroll: true }));
        await key(page, 'End', 35);
        const end = await state(page);
        assert.ok(Math.abs(end.scroll - end.maximum) < 2);
        assert.equal(end.nextDisabled, true);
        assert.equal(end.position, 'Etapa 3 de 3');
        assert.ok(end.steps[2].box.left >= end.box.left - 1 && end.steps[2].box.right <= end.box.right + 1);
        await capture(page, `${width}-last.jpg`);
        await key(page, 'Home', 36);
        assert.ok((await state(page)).scroll < 2);
        await key(page, 'ArrowRight', 39);
        assert.equal((await state(page)).position, 'Etapa 2 de 3');
        await key(page, 'ArrowLeft', 37);
        assert.equal((await state(page)).position, 'Etapa 1 de 3');
        // Retarget before smooth scrolling reaches the next card's center.
        await page.eval(() => { document.documentElement.dataset.input = 'pointer'; });
        await page.eval(() => document.querySelector('[data-journey-next]').click());
        await sleep(40);
        await page.eval(() => document.querySelector('[data-journey-next]').click());
        await sleep(700);
        assert.equal((await state(page)).position, 'Etapa 3 de 3', 'Both rapid advances must be preserved');
        await page.eval(() => document.querySelector('[data-journey-previous]').click());
        await sleep(40);
        await page.eval(() => document.querySelector('[data-journey-next]').click());
        await sleep(700);
        assert.equal((await state(page)).position, 'Etapa 3 de 3', 'An in-flight reversal must use the requested destination');
      }
      assert.deepEqual(page.consoleErrors, []);
      results[width] = 'Horizontal row, copy fit, navigation, keyboard, motion and page containment passed';
      console.log(`${width}px: horizontal journey passed`);
    } finally { await page.close(); }
  }

  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await reduced.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await ready(reduced);
    const initial = await state(reduced);
    assert.equal(initial.motionHidden, true);
    assert.equal(initial.motion, 'paused');
    assert.ok(initial.packets.every(packet => packet.display === 'none'));
    await reduced.eval(() => document.querySelector('[data-journey-next]').click());
    await sleep(100);
    assert.equal((await state(reduced)).position, 'Etapa 2 de 3');
    await capture(reduced, '390-reduced-motion.jpg');
    results.reducedMotion = 'No animated packets; instant horizontal navigation remains available';
  } finally { await reduced.close(); }

  const noScript = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await noScript.send('Emulation.setScriptExecutionDisabled', { value: true });
    await ready(noScript);
    const initial = await state(noScript);
    assert.equal(initial.navigationHidden, true);
    assert.equal(initial.motionHidden, true);
    assert.ok(initial.packets.every(packet => packet.display === 'none'));
    await noScript.eval(() => {
      const viewport = document.querySelector('[data-journey-scroll]');
      viewport.scrollLeft = viewport.scrollWidth;
    });
    await sleep(100);
    assert.ok(Math.abs((await state(noScript)).scroll - initial.maximum) < 2);
    await capture(noScript, '390-no-js-last.jpg');
    results.noScript = 'All three steps readable with native horizontal scrolling';
  } finally { await noScript.close(); }
  writeFileSync(resolve(output, 'checks.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
