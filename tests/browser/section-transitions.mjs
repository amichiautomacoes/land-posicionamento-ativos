import { getExecutionContext } from '../../scripts/lib/execution-context.mjs';
import { Browser, sleep } from '../../scripts/lib/browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const { url, output } = getExecutionContext('reports/qa/section-transitions');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};
const load = async (page) => {
  await page.goto(url, { settleMs: 100 });
  await page.eval(() => document.fonts.ready.then(() => true));
};
const read = page => page.eval(() => {
  const title = document.querySelector('#platform-title').getBoundingClientRect();
  const first = document.querySelector('#centralize h3').getBoundingClientRect();
  return {
    gapToFirstSolution: first.top - title.bottom,
    overflow: document.documentElement.scrollWidth - innerWidth,
    sections: [...document.querySelectorAll('main > section')].map(section => {
      const transition = section.querySelector('[data-section-transition]');
      const heading = section.querySelector('h1,h2');
      const opening = section.querySelector('[data-section-opening]');
      const line = transition ? getComputedStyle(transition) : null;
      return {
        id: section.id || 'hero', heading: heading.textContent, text: section.innerText,
        font: getComputedStyle(heading).font, columns: getComputedStyle(section).gridTemplateColumns,
        media: [...section.querySelectorAll('img')].map(image => image.getAttribute('src')),
        hasTransition: Boolean(transition),
        hiddenFromAT: transition?.getAttribute('aria-hidden') === 'true',
        pointerEvents: line?.pointerEvents, lineHeight: line?.height,
        blur: transition ? getComputedStyle(transition, '::before').filter : null,
        openingConnector: opening ? getComputedStyle(opening, '::after').width : null,
      };
    }),
  };
});

try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ width, height: 900, mobile: width < 600 });
    try {
      await load(page);
      const current = await read(page);
      assert.equal(current.overflow, 0);
      assert.equal(current.sections.length, 8);
      assert.equal(current.sections.filter(section => section.hasTransition).length, 6);
      for (const section of current.sections) {
        if (['hero', 'diagnostico'].includes(section.id)) {
          assert.equal(section.hasTransition, false, 'No separator below the header or before contact');
          assert.equal(section.openingConnector, null);
          continue;
        }
        assert.equal(section.hiddenFromAT, true);
        assert.equal(section.pointerEvents, 'none');
        assert.equal(section.lineHeight, '1px');
        assert.equal(section.blur, 'none');
        assert.equal(section.openingConnector, '1px');
      }
      for (const section of current.sections) {
        await page.eval(id => {
          const section = id === 'hero' ? document.querySelector('.hero') : document.getElementById(id);
          window.scrollTo({ top: Math.max(0, section.getBoundingClientRect().top + scrollY - 96), behavior: 'instant' });
        }, section.id);
        await sleep(260);
        const opacity = await page.eval(async id => {
          const section = id === 'hero' ? document.querySelector('.hero') : document.getElementById(id);
          const transition = section.querySelector('[data-section-transition]');
          // Wait for the actual completion instead of sampling the last animation frame.
          await Promise.all((transition?.getAnimations() ?? []).map(animation => animation.finished.catch(() => {})));
          return transition ? getComputedStyle(transition).opacity : 'absent';
        }, section.id);
        assert.equal(opacity, section.hasTransition ? '1' : 'absent', `${width}px: ${section.id} separator state`);
        await page.screenshot({ path: resolve(output, `${width}-${section.id}.jpg`), quality: 82 });
      }
      if ([1440, 390].includes(width)) {
        await page.eval(() => { document.documentElement.style.fontSize = '200%'; });
        await sleep(100);
        assert.equal((await read(page)).overflow, 0, 'Decorative layers must not overflow with enlarged text');
      }
      assert.deepEqual(page.consoleErrors, []);
      results[width] = current;
      console.log(`${width}px: six transitions visible; header and contact unseparated; content, fonts and layout preserved; first-solution gap ${current.gapToFirstSolution.toFixed(1)}px`);
    } finally { await page.close(); }
  }

  const motion = await browser.newPage({ width: 1440, height: 900 });
  try {
    await load(motion);
    await motion.eval(() => {
      const opening = document.querySelector('#platform [data-section-transition]');
      window.scrollTo({ top: opening.getBoundingClientRect().top + scrollY - 120, behavior: 'instant' });
    });
    await sleep(40);
    const animated = await motion.eval(() => document.querySelector('#platform [data-section-transition]').getAnimations().map(animation => ({
      duration: animation.effect.getTiming().duration,
      keyframes: animation.effect.getKeyframes().map(({ opacity, transform }) => ({ opacity, transform })),
    })));
    assert.equal(animated.length, 1, 'The decoration must fade as it enters the viewport');
    assert.equal(animated[0].duration, 220);
    assert.ok(animated[0].keyframes.every(frame => frame.transform === undefined), 'Only opacity should animate');
    await motion.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await sleep(50);
    assert.equal(await motion.eval(() => document.querySelectorAll('[data-transition-pending]').length), 0);
    assert.equal(await motion.eval(() => document.querySelector('#platform [data-section-transition]').getAnimations().length), 0);
    await motion.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    assert.equal(await motion.eval(() => [...document.querySelectorAll('[data-section-transition]')].every(element => getComputedStyle(element).opacity === '1')), true);
    results.motion = animated;
    console.log('Entrance: 220ms opacity only; live reduced-motion changes never leave hidden decorations');
    await load(motion);
    for (const type of ['keyDown', 'keyUp']) {
      await motion.send('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    }
    await motion.eval(() => document.querySelector('#platform').scrollIntoView({ behavior: 'instant' }));
    await sleep(50);
    assert.equal(await motion.eval(() => {
      const transition = document.querySelector('#platform [data-section-transition]');
      return getComputedStyle(transition).opacity === '1' && transition.getAnimations().length === 0;
    }), true, 'Keyboard navigation must reveal the decoration immediately');
    results.keyboard = 'Immediate reveal without animation';
  } finally { await motion.close(); }

  for (const mode of ['reduced-motion', 'no-javascript']) {
    const page = await browser.newPage({ width: 390, height: 900, mobile: true, reducedMotion: mode === 'reduced-motion' });
    try {
      if (mode === 'no-javascript') await page.send('Emulation.setScriptExecutionDisabled', { value: true });
      await load(page);
      assert.equal(await page.eval(() => [...document.querySelectorAll('[data-section-transition]')].every(element => getComputedStyle(element).opacity === '1' && element.getAnimations().length === 0)), true);
      assert.equal((await read(page)).overflow, 0);
      results[mode] = 'All six decorations remain visible and static; header and contact have no separator';
      console.log(`${mode}: all six transitions retain their static presentation`);
    } finally { await page.close(); }
  }
  writeFileSync(resolve(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
