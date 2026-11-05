import { getExecutionContext } from '../../scripts/lib/execution-context.mjs';
import { Browser, sleep } from '../../scripts/lib/browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const { url, output } = getExecutionContext('reports/qa/benefits-flow');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = {};
const ready = async page => {
  await page.goto(url, { settleMs: 200 });
  await page.eval(async () => {
    await document.fonts.ready;
    const section = document.querySelector('#capabilities-copy');
    section.scrollIntoView({ behavior: 'instant', block: 'start' });
    const images = [...section.querySelectorAll('img')];
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode()));
  });
  await sleep(250);
};
const state = page => page.eval(() => ({
  selected: [...document.querySelectorAll('#capabilities-copy [data-flow-control]')].map(button => button.getAttribute('aria-pressed')),
  original: [...document.querySelectorAll('#capabilities [data-journey-step] h3')].map(heading => heading.textContent),
  overflow: document.documentElement.scrollWidth - innerWidth,
  cards: [...document.querySelectorAll('#capabilities-copy [data-flow-step]')].map(card => ({
    box: card.getBoundingClientRect().toJSON(),
    text: card.querySelector('.flow-step-text').getBoundingClientRect().toJSON(),
    art: card.querySelector('.flow-step-art').getBoundingClientRect().toJSON(),
    preview: card.querySelector('.flow-step-preview').getBoundingClientRect().toJSON(),
    previewOpacity: getComputedStyle(card.querySelector('.flow-step-preview')).opacity,
    headingLines: Math.round(card.querySelector('h3').getBoundingClientRect().height / parseFloat(getComputedStyle(card.querySelector('h3')).lineHeight)),
    controlHidden: card.querySelector('button').hidden,
  })),
}));
const capture = async (page, name) => {
  const clip = await page.eval(() => {
    const rect = document.querySelector('#capabilities-copy').getBoundingClientRect();
    return { x: 0, y: rect.top + scrollY, width: innerWidth, height: Math.ceil(rect.height), scale: 1 };
  });
  const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, captureBeyondViewport: true, clip });
  writeFileSync(resolve(output, name), Buffer.from(data, 'base64'));
};
try {
  for (const [width, height] of [[1440, 1000], [1100, 1000], [1021, 1000], [768, 1024], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 });
    try {
      await ready(page);
      const titles = await page.eval(() => [...document.querySelectorAll('#capabilities-copy h3')].map(heading => heading.textContent));
      assert.deepEqual(titles, ['Mais visibilidade', 'Mais oportunidades', 'Atendimento ágil', 'Mais produtividade']);
      const artwork = await page.eval(() => [...document.querySelectorAll('#capabilities-copy [data-flow-step]')].map(card => {
        const preview = card.querySelector('.flow-step-preview img');
        const art = card.querySelector('.flow-step-art img');
        const frame = card.querySelector('.flow-step-art').getBoundingClientRect();
        const image = art.getBoundingClientRect();
        return {
          source: art.currentSrc, preview: preview.currentSrc,
          loaded: preview.naturalWidth > 0 && art.naturalWidth > 0,
          aspect: art.naturalWidth / art.naturalHeight,
          naturalHeight: art.naturalHeight,
          fills: getComputedStyle(art).objectFit === 'cover' && Math.abs(frame.width - image.width) < 1 && Math.abs(frame.height - image.height) < 1,
        };
      }));
      const device = width > 1020 ? 'desktop' : width >= 640 ? 'tablet' : 'mobile';
      const aspect = device === 'desktop' ? 3 / 7 : device === 'tablet' ? 1 : 3 / 2;
      artwork.forEach(image => {
        assert.ok(image.loaded, 'Both closed and opened artwork must load');
        assert.notEqual(image.source, image.preview, 'The opened card must use its own artwork');
        assert.ok(image.source.includes(`-expanded-${device}-`), 'Opened artwork must match the current responsive layout');
        // srcset density correction rounds both intrinsic dimensions to CSS pixels.
        assert.ok(Math.abs(image.aspect - aspect) <= (1 + aspect) / image.naturalHeight, 'Opened artwork must have the shape of its panel');
        assert.ok(image.fills, 'Opened artwork must cover the whole image panel without letterboxing');
      });
      const initial = await state(page);
      assert.equal(initial.overflow, 0);
      initial.cards.forEach(card => {
        assert.ok(card.headingLines <= 3);
        assert.ok(card.text.right <= card.box.right + 1, 'All copy must fit inside its card');
        assert.ok(card.text.bottom <= card.box.bottom + 1);
      });
      await capture(page, `${width}-initial.jpg`);
      if (width > 1020) {
        for (const index of [1, 2, 3, 0]) {
          const point = await page.eval(index => {
            const box = document.querySelectorAll('#capabilities-copy [data-flow-step]')[index].getBoundingClientRect();
            return { x: box.left + 40, y: box.top + 40 };
          }, index);
          await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
          await sleep(300);
          const current = await state(page);
          assert.deepEqual(current.selected, titles.map((_, card) => String(card === index)));
          assert.deepEqual(current.original, initial.original, 'Benefits must not change the horizontal journey');
          assert.equal(current.overflow, 0);
          current.cards.forEach((card, cardIndex) => {
            assert.equal(card.previewOpacity, cardIndex === index ? '0' : '1');
            assert.ok(card.preview.height >= 80, 'Collapsed cards need a readable image preview');
            assert.ok(card.preview.bottom < card.text.top, 'Previews must stay above the copy');
            assert.ok(card.preview.right <= card.box.right + 1);
            const ratio = card.box.width / current.cards[(index + 1) % 4].box.width;
            assert.ok(Math.abs(ratio - (cardIndex === index ? 2 : 1)) < .02);
            assert.ok(Math.abs(card.text.width - initial.cards[cardIndex].text.width) < .1);
          });
          if (index === 3) await capture(page, `${width}-fourth-expanded.jpg`);
          else if (width === 1440 && index > 0) await capture(page, `${width}-${index + 1}-expanded.jpg`);
        }
        await page.eval(() => document.querySelector('#capabilities-copy [data-flow-control]').focus());
        await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
        assert.deepEqual((await state(page)).selected, ['false', 'false', 'false', 'true']);
        await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
        assert.deepEqual((await state(page)).selected, ['true', 'false', 'false', 'false']);
      } else {
        initial.cards.forEach((card, index) => {
          assert.equal(card.controlHidden, true);
          assert.ok(card.art.height > 100);
          if (index) assert.ok(card.box.top >= initial.cards[index - 1].box.bottom);
        });
      }
      assert.deepEqual(page.consoleErrors, []);
      results[width] = 'Four benefits readable; independent selection, keyboard, fixed text and responsive geometry passed';
      console.log(`${width}px: four benefits, layout, copy fit and interaction passed`);
    } finally { await page.close(); }
  }
  for (const mode of ['reduced-motion', 'no-javascript']) {
    const page = await browser.newPage({ width: 1440, height: 1000, reducedMotion: mode === 'reduced-motion' });
    try {
      if (mode === 'no-javascript') await page.send('Emulation.setScriptExecutionDisabled', { value: true });
      await ready(page);
      if (mode === 'reduced-motion') {
        await page.eval(() => document.querySelectorAll('#capabilities-copy [data-flow-control]')[3].click());
        assert.deepEqual((await state(page)).selected, ['false', 'false', 'false', 'true']);
        assert.equal(await page.eval(() => document.querySelector('#capabilities-copy').getAnimations({ subtree: true }).length), 0);
      } else {
        const fallback = await state(page);
        fallback.cards.forEach(card => {
          assert.equal(card.controlHidden, true);
          assert.ok(card.art.right <= card.box.right + 1);
          assert.ok(card.text.bottom <= card.box.bottom + 1);
        });
      }
      await capture(page, `${mode}.jpg`);
      assert.equal((await state(page)).overflow, 0);
      results[mode] = 'passed';
      console.log(`${mode}: passed`);
    } finally { await page.close(); }
  }
  writeFileSync(resolve(output, 'verification.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
