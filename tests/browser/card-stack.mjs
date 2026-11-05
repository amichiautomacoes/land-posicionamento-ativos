import { getExecutionContext } from '../../scripts/lib/execution-context.mjs';
import { Browser, sleep } from '../../scripts/lib/browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const { url, output } = getExecutionContext('reports/qa/card-stack');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};
const selectors = ['.solution-card--google', '.solution-card--ads', '.solution-card--whatsapp'];

const ready = async (page) => {
  await page.goto(url, { settleMs: 200 });
  await page.eval(async () => {
    await document.fonts.ready;
    document.querySelector('#advantage').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await sleep(250);
};
const pressed = (page) => page.eval(() => [...document.querySelectorAll('[data-stack-card]')].map(card => card.getAttribute('aria-pressed')));
const point = (page, selector) => page.eval((selector) => {
  const rect = document.querySelector(selector).getBoundingClientRect();
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}, selector);
const mouse = async (page, position, click = false) => {
  await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...position });
  if (!click) return;
  await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...position });
  await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...position });
};
const key = async (page, name, code, windowsVirtualKeyCode) => {
  for (const type of ['keyDown', 'keyUp']) {
    const text = type === 'keyDown' && name === 'Enter' ? '\r' : undefined;
    await page.send('Input.dispatchKeyEvent', { type, key: name, code, windowsVirtualKeyCode, text, unmodifiedText: text });
  }
};

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 });
    try {
      await ready(page);
      const layout = await page.eval(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        titles: [...document.querySelectorAll('.solution-card-title')].map(title => title.textContent),
        enabled: [...document.querySelectorAll('[data-stack-card]')].every(card => !card.disabled),
        section: document.querySelector('#advantage').getBoundingClientRect().toJSON(),
        copy: document.querySelector('.advantage-copy').getBoundingClientRect().toJSON(),
        stack: document.querySelector('.solution-stack').getBoundingClientRect().toJSON(),
      }));
      assert.equal(layout.overflow, 0, `${width}px overflow`);
      assert.deepEqual(layout.titles, ['Google', 'Redes Sociais', 'WhatsApp']);
      assert.equal(layout.enabled, true);
      assert.deepEqual(await pressed(page), ['false', 'false', 'false']);
      if (width >= 640) {
        assert.equal(layout.copy.width, layout.section.width / 2);
        assert.ok(layout.stack.left >= layout.copy.right);
      } else assert.ok(layout.stack.top >= layout.copy.bottom);
      await page.screenshot({ path: resolve(output, `stack-${width}.jpg`), quality: 88 });

      // Longer section copy can put the cards below the first viewport on phones.
      await page.eval(() => document.querySelector('.solution-stack-stage').scrollIntoView({ behavior: 'instant', block: 'center' }));
      await sleep(250);
      for (const [index, selector] of selectors.entries()) {
        const position = await point(page, `${selector} .solution-card-title`);
        if (width >= 600) {
          await mouse(page, position);
          await sleep(280);
          const hit = await page.eval(({ x, y }) => document.elementFromPoint(x, y)?.closest('[data-stack-card]')?.className, position);
          assert.ok(hit?.includes(selector.slice(1)), `${width}px ${selector} hover must keep the original click target; found ${hit}`);
          await mouse(page, position, true);
        } else {
          await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [position] });
          await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        }
        await sleep(280);
        assert.deepEqual(await pressed(page), selectors.map((_, current) => String(current === index)));
        const expanded = await page.eval((selector) => {
          const card = document.querySelector(selector).getBoundingClientRect();
          const stage = document.querySelector('.solution-stack-stage').getBoundingClientRect();
          return { fits: card.left >= stage.left - 1 && card.right <= stage.right + 1 && card.top >= stage.top - 1 && card.bottom <= stage.bottom + 1, width: card.width, stageWidth: stage.width };
        }, selector);
        assert.ok(expanded.fits, `${width}px selected card must fit its stage`);
        assert.ok(expanded.width > expanded.stageWidth * .65);
        const titlesVisible = await page.eval(() => [...document.querySelectorAll('[data-stack-card]')].every(card => {
          const rect = card.querySelector('.solution-card-title').getBoundingClientRect();
          return [rect.left + 1, rect.right - 1].every(x => card.contains(document.elementFromPoint(x, rect.y + rect.height / 2)));
        }));
        assert.ok(titlesVisible, `${width}px all channel titles must remain visible while a card is open`);
        if (width === 1440 || (width === 390 && index === 2)) {
          await page.screenshot({ path: resolve(output, `stack-${width}-${index}-open.jpg`), quality: 88 });
        }
        // A real outside press restores the fan before testing the next card.
        await mouse(page, { x: 2, y: 2 }, true);
        await sleep(280);
        assert.deepEqual(await pressed(page), ['false', 'false', 'false']);
      }
      assert.deepEqual(page.consoleErrors, []);
      results[width] = 'Responsive layout, real mouse/touch activation, stable hover hit areas, exclusive expansion, full card visibility and outside dismissal passed';
      console.log(`${width}px: passed`);
    } finally { await page.close(); }
  }

  const keyboard = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await ready(keyboard);
    await keyboard.eval(() => document.querySelector('.advantage .accent-link').focus({ preventScroll: true }));
    await key(keyboard, 'Tab', 'Tab', 9);
    assert.equal(await keyboard.eval(() => document.activeElement.matches('.solution-card--google:focus-visible')), true);
    assert.equal(await keyboard.eval(() => getComputedStyle(document.querySelector('.solution-card-face')).outlineStyle), 'solid');
    await keyboard.screenshot({ path: resolve(output, 'keyboard-focus.jpg'), quality: 88 });
    await key(keyboard, 'Enter', 'Enter', 13);
    assert.deepEqual(await pressed(keyboard), ['true', 'false', 'false']);
    assert.equal(await keyboard.eval(() => getComputedStyle(document.activeElement).transitionProperty), 'none');
    await key(keyboard, 'Tab', 'Tab', 9);
    await keyboard.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    assert.equal(await keyboard.eval(() => getComputedStyle(document.activeElement).scale), 'none', 'Keyboard press must not shrink the card');
    await keyboard.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    assert.deepEqual(await pressed(keyboard), ['false', 'true', 'false']);
    await key(keyboard, 'Escape', 'Escape', 27);
    await key(keyboard, ' ', 'Space', 32);
    assert.deepEqual(await pressed(keyboard), ['false', 'true', 'false']);
    await key(keyboard, 'Escape', 'Escape', 27);
    assert.deepEqual(await pressed(keyboard), ['false', 'false', 'false']);
    await key(keyboard, 'Enter', 'Enter', 13);
    await key(keyboard, 'Enter', 'Enter', 13);
    assert.deepEqual(await pressed(keyboard), ['false', 'false', 'false']);
    results.keyboard = 'Native Tab, Enter and Space, visible focus, exclusive switching, repeat activation, Escape and immediate keyboard feedback passed';
    console.log('Keyboard: passed');
  } finally { await keyboard.close(); }

  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true, reducedMotion: true });
  try {
    await ready(reduced);
    await reduced.eval(() => document.querySelector('.solution-card--whatsapp').click());
    assert.deepEqual(await pressed(reduced), ['false', 'false', 'true']);
    assert.equal(await reduced.eval(() => getComputedStyle(document.querySelector('.solution-card--whatsapp')).transitionDuration), '0s');
    results.reducedMotion = 'Expanded state remains available without animated movement';
    console.log('Reduced motion: passed');
  } finally { await reduced.close(); }

  const fallback = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await fallback.send('Emulation.setScriptExecutionDisabled', { value: true });
    await ready(fallback);
    assert.equal(await fallback.eval(() => [...document.querySelectorAll('[data-stack-card]')].every(card => card.disabled && card.getBoundingClientRect().height > 100)), true);
    results.noJavaScript = 'All channel titles remain visible as static cards with inactive controls';
    console.log('No JavaScript: passed');
  } finally { await fallback.close(); }
  writeFileSync(resolve(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
