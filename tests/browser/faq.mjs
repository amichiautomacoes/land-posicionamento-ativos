import { Browser, sleep } from './support/browser-env.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const url = process.argv[2] || 'http://127.0.0.1:5017/';
const output = resolve('reports/qa/faq');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};
const expectedCopy = readFileSync(resolve('faq_07.txt'), 'utf8').split(/^### \d+\.\s+/m).slice(1).map(block => {
  const [question, ...lines] = block.trim().split(/\r?\n/);
  return { question, answer: lines.join('\n').trim() };
});
const load = async (page) => {
  await page.goto(url, { settleMs: 100 });
  assert.equal(await page.eval(() => Boolean(document.querySelector('[data-faq]'))), true, 'The FAQ must be present in the served page');
  await page.eval(() => document.fonts.ready.then(() => true));
  await page.eval(() => {
    document.querySelector('#before-start').scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollBy({ top: -48, behavior: 'instant' });
  });
  await sleep(260);
};
const state = (page) => page.eval(() => [...document.querySelectorAll('[data-faq-item]')].map(item => {
  const trigger = item.querySelector('[data-faq-trigger]');
  const answer = item.querySelector('[data-faq-answer]');
  return {
    expanded: trigger.getAttribute('aria-expanded') === 'true',
    hidden: answer.hidden,
    inert: answer.inert,
    ariaHidden: answer.getAttribute('aria-hidden'),
    controls: trigger.getAttribute('aria-controls') === answer.id,
    labelled: answer.getAttribute('aria-labelledby') === trigger.id,
  };
}));
const click = (page, index) => page.eval(index => document.querySelectorAll('[data-faq-trigger]')[index].click(), index);
const key = async (page, key, code, windowsVirtualKeyCode) => {
  for (const type of ['keyDown', 'keyUp']) {
    const text = type === 'keyDown' ? (key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined) : undefined;
    await page.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode, text, unmodifiedText: text });
  }
};

try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 });
    try {
      await load(page);
      const initial = await state(page);
      assert.equal(initial.length, 6);
      assert.deepEqual(await page.eval(() => [...document.querySelectorAll('[data-faq-item]')].map(item => ({
        question: item.querySelector('[data-faq-trigger] > span').textContent,
        answer: item.querySelector('.faq-answer-content p').textContent,
      }))), expectedCopy, 'All supplied questions and answers must be preserved verbatim and in order');
      assert.equal(initial.filter(item => item.expanded).length, 0, 'All questions must start closed');
      assert.ok(initial.every(item => item.controls && item.labelled));
      assert.ok(initial.every(item => item.hidden && item.inert && item.ariaHidden === 'true'));
      const geometry = await page.eval(() => {
        const intro = document.querySelector('.before-start-intro').getBoundingClientRect();
        const list = document.querySelector('[data-faq]').getBoundingClientRect();
        const columns = [...document.querySelectorAll('.faq-column')];
        const [left, right] = columns.map(column => column.getBoundingClientRect());
        const support = document.querySelector('.faq-support').getBoundingClientRect();
        return {
          introAbove: list.top >= intro.bottom,
          textAlignment: getComputedStyle(document.querySelector('.before-start-intro')).textAlign,
          ctaCentered: Math.abs(support.left + support.width / 2 - (intro.left + intro.width / 2)) < 1,
          questionsPerColumn: columns.map(column => column.querySelectorAll('[data-faq-item]').length),
          sideBySide: right.left >= left.right,
          stacked: right.top >= left.bottom,
          overflow: document.documentElement.scrollWidth - innerWidth,
          minTarget: Math.min(...[...document.querySelectorAll('[data-faq-trigger]')].map(item => item.getBoundingClientRect().height)),
        };
      });
      assert.equal(geometry.overflow, 0);
      assert.ok(geometry.minTarget >= 44);
      assert.equal(geometry.introAbove, true);
      assert.equal(geometry.textAlignment, 'center');
      assert.equal(geometry.ctaCentered, true);
      assert.deepEqual(geometry.questionsPerColumn, [3, 3]);
      assert.equal(width > 1020 ? geometry.sideBySide : geometry.stacked, true);
      if ([1440, 768, 390].includes(width)) await page.screenshot({ path: resolve(output, `${width}-faq.jpg`), quality: 90 });

      await click(page, 2);
      assert.equal((await state(page)).filter(item => item.expanded).length, 1);
      await sleep(260);
      const opened = await state(page);
      assert.equal(opened[2].expanded, true);
      assert.ok(opened.filter((_, index) => index !== 2).every(item => item.hidden && item.inert));

      await click(page, 2);
      await sleep(35);
      await click(page, 2);
      await sleep(260);
      assert.equal((await state(page))[2].hidden, false, 'An interrupted closing timer must not hide a reopened answer');
      await click(page, 5);
      await sleep(260);
      assert.equal((await state(page))[2].hidden, true, 'Opening a question in the other column must close the current answer');
      assert.equal((await state(page))[5].expanded, true);
      await click(page, 4);
      await sleep(260);
      assert.equal((await state(page)).filter(item => item.expanded).length, 1);

      await page.eval(() => {
        const triggers = document.querySelectorAll('[data-faq-trigger]');
        triggers[4].querySelector('span').textContent = 'LongQuestion'.repeat(30);
        document.querySelectorAll('.faq-answer-content p')[4].textContent = 'Long answer with multiple lines of readable content. '.repeat(80);
        document.documentElement.style.fontSize = '200%';
      });
      await sleep(260);
      assert.equal(await page.eval(() => document.documentElement.scrollWidth - innerWidth), 0, 'Long content and enlarged text must fit');
      assert.equal(await page.eval(() => {
        const clip = document.querySelectorAll('.faq-answer-clip')[4];
        return clip.scrollHeight <= clip.clientHeight + 1;
      }), true, 'The expanded answer must grow with the content');
      assert.deepEqual(page.consoleErrors, []);
      results[width] = { ...geometry, exclusive: true, interruptedToggle: true, enlargedText: true };
      console.log(`${width}px: responsive layout, exclusive opening, interruption and 200% text passed`);
    } finally { await page.close(); }
  }

  const keyboard = await browser.newPage({ width: 1440, height: 1000 });
  try {
    await load(keyboard);
    await keyboard.eval(() => document.querySelector('[data-faq-trigger]').focus());
    await key(keyboard, 'ArrowDown', 'ArrowDown', 40);
    assert.equal(await keyboard.eval(() => document.activeElement.id), 'faq-2-trigger');
    await key(keyboard, 'Enter', 'Enter', 13);
    assert.equal((await state(keyboard))[1].expanded, true);
    assert.equal((await state(keyboard))[0].hidden, true, 'Keyboard disclosure must settle immediately');
    await key(keyboard, ' ', 'Space', 32);
    assert.equal((await state(keyboard))[1].expanded, false);
    await key(keyboard, 'End', 'End', 35);
    assert.equal(await keyboard.eval(() => document.activeElement.id), `faq-${expectedCopy.length}-trigger`);
    await key(keyboard, 'Home', 'Home', 36);
    assert.equal(await keyboard.eval(() => document.activeElement.id), 'faq-1-trigger');
    await key(keyboard, 'Tab', 'Tab', 9);
    assert.equal(await keyboard.eval(() => document.activeElement.id), 'faq-2-trigger');
    assert.equal(await keyboard.eval(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
    await keyboard.screenshot({ path: resolve(output, 'keyboard-focus.jpg'), quality: 90 });
    const accessibility = await keyboard.send('Accessibility.getFullAXTree');
    const expandedNodes = accessibility.nodes.filter(node => node.role?.value === 'button' && node.properties?.some(property => property.name === 'expanded'));
    assert.ok(expandedNodes.length >= expectedCopy.length, 'Screen readers must receive native button names and disclosure states');
    const supportContact = await keyboard.eval(() => {
      const control = document.querySelector('.faq-support');
      return { tag: control.tagName, href: control.getAttribute('href'), disabled: control.disabled, target: control.getAttribute('target') };
    });
    if (supportContact.tag === 'A') {
      assert.ok(supportContact.href.startsWith('https://wa.me/'));
      assert.equal(supportContact.target, '_blank');
    } else {
      assert.equal(supportContact.tag, 'BUTTON');
      assert.equal(supportContact.disabled, true);
      assert.equal(supportContact.href, null);
    }
    results.keyboard = 'Tab, Enter, Space, arrows, Home/End, focus outline, accessible state and contact destination passed';
    assert.deepEqual(keyboard.consoleErrors, []);
  } finally { await keyboard.close(); }

  for (const mode of ['reduced-motion', 'no-javascript']) {
    const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: mode === 'reduced-motion' });
    try {
      if (mode === 'no-javascript') await page.send('Emulation.setScriptExecutionDisabled', { value: true });
      await load(page);
      if (mode === 'reduced-motion') {
        await click(page, 1);
        assert.equal((await state(page))[0].hidden, true);
        assert.equal(await page.eval(() => document.querySelector('[data-faq-answer]').getAnimations().length), 0);
      } else {
        const initial = await state(page);
        assert.ok(initial.every(item => !item.hidden && !item.inert));
        assert.equal(await page.eval(() => [...document.querySelectorAll('[data-faq-trigger]')].every(button => button.disabled)), true);
      }
      assert.equal(await page.eval(() => document.documentElement.scrollWidth - innerWidth), 0);
      await page.screenshot({ path: resolve(output, `${mode}.jpg`), quality: 90 });
      assert.deepEqual(page.consoleErrors, []);
      results[mode] = 'Visible content, no overflow and appropriate disclosure state passed';
      console.log(`${mode}: passed`);
    } finally { await page.close(); }
  }
  writeFileSync(resolve(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
