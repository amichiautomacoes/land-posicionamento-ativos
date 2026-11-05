import { getExecutionContext } from '../../scripts/lib/execution-context.mjs';
import { Browser, sleep } from '../../scripts/lib/browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const { url, output } = getExecutionContext('reports/qa/interactions');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};

const key = async (page, name, code, virtualKey) => {
  for (const type of ['keyDown', 'keyUp']) {
    const text = type === 'keyDown' && name === 'Enter' ? '\r' : undefined;
    await page.send('Input.dispatchKeyEvent', { type, key: name, code, windowsVirtualKeyCode: virtualKey, text, unmodifiedText: text });
  }
};
const until = async (page, predicate, message) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(predicate)) return;
    await sleep(50);
  }
  assert.fail(message);
};
const ready = async (page, target = url) => {
  await page.goto(target, { settleMs: 500 });
  await page.eval(() => document.fonts.ready.then(() => true));
};
const metrics = async (page) => Object.fromEntries((await page.send('Performance.getMetrics')).metrics.map(item => [item.name, item.value]));

try {
  const keyboard = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await ready(keyboard);
    await key(keyboard, 'Tab', 'Tab', 9);
    assert.equal(await keyboard.eval(() => document.activeElement.matches('.skip-link:focus-visible')), true);
    await key(keyboard, 'Enter', 'Enter', 13);
    assert.equal(await keyboard.eval(() => document.activeElement.id), 'main');
    await ready(keyboard);
    for (let i = 0; i < 3; i++) await key(keyboard, 'Tab', 'Tab', 9);
    assert.equal(await keyboard.eval(() => document.activeElement.matches('.menu-toggle:focus-visible')), true);
    await keyboard.screenshot({ path: resolve(output, 'keyboard-focus.jpg'), quality: 90 });
    assert.equal(await keyboard.eval(() => document.querySelector('.navigation-content').hidden), true);
    await key(keyboard, 'Enter', 'Enter', 13);
    assert.equal(await keyboard.eval(() => document.querySelector('.navigation-content').hidden), false);
    assert.equal(await keyboard.eval(() => getComputedStyle(document.querySelector('.menu-toggle span')).transitionProperty), 'none');
    await key(keyboard, 'Tab', 'Tab', 9);
    assert.equal(await keyboard.eval(() => document.activeElement.textContent), 'Soluções');
    await key(keyboard, 'Enter', 'Enter', 13);
    assert.equal(await keyboard.eval(() => document.activeElement.id), 'platform');
    assert.equal(await keyboard.eval(() => document.querySelector('.navigation-content').hidden), true);
    assert.equal(await keyboard.eval(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.equal(await keyboard.eval(() => document.querySelector('#platform [data-reveal]').getAnimations().length), 0);
    await keyboard.eval(() => document.querySelector('.menu-toggle').focus({ preventScroll: true }));
    await key(keyboard, 'Enter', 'Enter', 13);
    await key(keyboard, 'Escape', 'Escape', 27);
    assert.equal(await keyboard.eval(() => document.activeElement.matches('.menu-toggle')), true);
    assert.equal(await keyboard.eval(() => document.querySelector('.navigation-content').hidden), true);
    await keyboard.setViewport({ width: 1440, height: 900 });
    await until(keyboard, () => document.querySelector('.menu-toggle').hidden, 'Desktop navigation did not replace mobile disclosure');
    assert.equal(await keyboard.eval(() => document.activeElement.textContent), 'Soluções');
    await keyboard.setViewport({ width: 390, height: 844, mobile: true });
    await until(keyboard, () => !document.querySelector('.menu-toggle').hidden, 'Mobile disclosure did not return');
    assert.equal(await keyboard.eval(() => document.activeElement.matches('.menu-toggle')), true);
    await keyboard.send('Accessibility.enable');
    const tree = (await keyboard.send('Accessibility.getFullAXTree')).nodes;
    const contactLabels = ['Quero atrair mais clientes', 'Tirar minhas dúvidas no WhatsApp', 'Quero fazer meu negócio crescer'];
    const contacts = tree.filter(node => !node.ignored && node.role?.value === 'button' && contactLabels.includes(node.name?.value));
    assert.equal(contacts.length, 3);
    assert.ok(contacts.every(node => node.properties.some(property => property.name === 'disabled' && property.value.value === true)));
    assert.equal(tree.some(node => !node.ignored && node.role?.value === 'link' && node.name?.value === 'Soluções'), false);
    // Exercise the enabled contact's CSS in isolation; keep application configuration untouched.
    await keyboard.eval(() => {
      const disabled = document.querySelector('.cta .button');
      const link = document.createElement('a');
      link.className = disabled.className;
      link.href = '#main';
      link.innerHTML = disabled.innerHTML;
      disabled.replaceWith(link);
      link.focus({ preventScroll: true });
      link.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    assert.equal(await keyboard.eval(() => document.activeElement.matches('.cta .button:focus-visible')), true);
    assert.equal(await keyboard.eval(() => getComputedStyle(document.activeElement).outlineColor), 'rgb(16, 27, 51)');
    await keyboard.screenshot({ path: resolve(output, 'light-surface-focus.jpg'), quality: 90 });
    assert.deepEqual(keyboard.consoleErrors, []);
    results.keyboard = 'Skip link, native Tab/Enter/Escape, target focus, no keyboard motion, responsive focus recovery and accessibility tree passed';
  } finally { await keyboard.close(); }

  const pointer = await browser.newPage({ width: 1440, height: 900 });
  try {
    await ready(pointer);
    await pointer.eval(() => document.querySelector('.hero-video').pause());
    const button = await pointer.eval(() => {
      const el = document.querySelector('.nav-actions .button'); const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, width: el.offsetWidth };
    });
    await pointer.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: button.x, y: button.y });
    await sleep(200);
    assert.equal(await pointer.eval(() => getComputedStyle(document.querySelector('.nav-actions .button'), '::before').opacity), '1');
    await pointer.send('Performance.enable');
    const before = await metrics(pointer);
    await pointer.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: button.x, y: button.y, button: 'left', buttons: 1, clickCount: 1 });
    await sleep(140);
    const after = await metrics(pointer);
    const pressed = await pointer.eval(() => {
      const el = document.querySelector('.nav-actions .button'); const style = getComputedStyle(el);
      return { transform: style.transform, width: el.offsetWidth, curve: style.transitionTimingFunction, opacity: getComputedStyle(el, '::after').opacity };
    });
    assert.ok(Math.abs(Number(pressed.transform.match(/matrix\(([^,]+)/)[1]) - .97) < .001);
    assert.equal(pressed.width, button.width);
    assert.equal(pressed.opacity, '1');
    assert.ok(pressed.curve.startsWith('cubic-bezier('));
    results.pressLayouts = after.LayoutCount - before.LayoutCount;
    assert.equal(results.pressLayouts, 0, 'Press feedback must not recalculate layout');
    await pointer.screenshot({ path: resolve(output, 'pointer-active.jpg'), quality: 90 });
    await pointer.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: button.x, y: button.y, button: 'left', buttons: 0, clickCount: 1 });
    // Start a fresh document after the measurement's deliberate media pause.
    await ready(pointer, new URL('?interaction=video', url).href);
    await until(pointer, () => !document.querySelector('.hero-video').paused, 'Visible hero did not resume automatically');
    const videoWidth = await pointer.eval(() => document.querySelector('.hero-video-toggle').offsetWidth);
    await pointer.eval(() => document.querySelector('.hero-video-toggle').click());
    await until(pointer, () => document.querySelector('.hero-video').paused, 'Manual pause failed');
    assert.equal(await pointer.eval(() => document.querySelector('.hero-video-toggle').offsetWidth), videoWidth);
    await pointer.eval(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await sleep(100);
    await pointer.eval(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(100);
    assert.equal(await pointer.eval(() => document.querySelector('.hero-video').paused), true, 'Visibility changes must preserve a manual pause');
    await pointer.eval(() => document.querySelector('.hero-video-toggle').click());
    await until(pointer, () => !document.querySelector('.hero-video').paused, 'Manual resume failed');
    await pointer.eval(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await until(pointer, () => document.querySelector('.hero-video').paused, 'Offscreen hero kept playing');
    await pointer.eval(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await until(pointer, () => !document.querySelector('.hero-video').paused, 'Returning to the hero did not resume playback');
    await pointer.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await until(pointer, () => document.querySelector('.hero-video').paused, 'Reduced motion did not pause the video');
    assert.equal(await pointer.eval(() => document.getAnimations().length), 0);
    await pointer.eval(() => document.querySelector('.hero-video-toggle').click());
    await until(pointer, () => !document.querySelector('.hero-video').paused, 'Reduced motion must still allow explicitly requested playback');
    await pointer.eval(() => document.querySelector('.hero-video-toggle').click());
    await until(pointer, () => document.querySelector('.hero-video').paused, 'Explicit playback could not be paused');
    assert.deepEqual(pointer.consoleErrors, []);
    results.pointer = 'Composited hover/press, fixed button box, custom easing, stable video control width, viewport playback and reduced motion with optional manual playback passed';
  } finally { await pointer.close(); }

  const touch = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await ready(touch);
    await touch.eval(() => document.querySelector('.hero-video').pause());
    assert.equal(await touch.eval(() => matchMedia('(hover: hover) and (pointer: fine)').matches), false);
    const button = await touch.eval(() => {
      const r = document.querySelector('.menu-toggle').getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...button, id: 1 }] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(220);
    assert.equal(await touch.eval(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded')), 'true');
    const expandedCenter = await touch.eval(() => {
      const r = document.querySelector('.menu-toggle').getBoundingClientRect();
      return r.y + r.height / 2;
    });
    assert.ok(Math.abs(expandedCenter - button.y) < .5, 'Opening the menu must not shift its trigger');
    assert.equal(await touch.eval(() => getComputedStyle(document.querySelector('.menu-toggle'), '::before').opacity), '0', 'Touch must not leave a hover layer behind');
    await touch.eval(() => document.querySelector('.menu-toggle').click());
    await sleep(200);
    await touch.send('Performance.enable');
    const before = await metrics(touch);
    await touch.eval(() => document.querySelector('.menu-toggle').click());
    await sleep(230);
    const after = await metrics(touch);
    results.menuPerformance = Object.fromEntries(['LayoutCount', 'LayoutDuration', 'RecalcStyleCount', 'RecalcStyleDuration'].map(name => [name, after[name] - before[name]]));
    results.menuPerformance.iconTransition = await touch.eval(() => getComputedStyle(document.querySelector('.menu-toggle span')).transitionProperty);
    assert.equal(results.menuPerformance.iconTransition, 'transform');
    assert.ok(results.menuPerformance.LayoutCount <= 2, 'Menu icon must not produce layout work on every animation frame');
    await touch.screenshot({ path: resolve(output, 'touch-menu.jpg'), quality: 90 });
    assert.deepEqual(touch.consoleErrors, []);
    results.touch = 'Native touch activation without sticky hover; menu morph uses transform only';
  } finally { await touch.close(); }

  writeFileSync(resolve(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
