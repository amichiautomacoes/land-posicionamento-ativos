import { getExecutionContext } from '../../scripts/lib/execution-context.mjs';
import { Browser, sleep } from '../../scripts/lib/browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const { url, output } = getExecutionContext('reports/qa/horizontal-journey');
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
    activeStep: Number(section.querySelector('[data-customer-journey]').dataset.activeStep),
    motionLabel: section.querySelector('[data-journey-motion-toggle]').getAttribute('aria-label'),
    documentHidden: document.hidden,
    journeyBox: section.querySelector('[data-customer-journey]').getBoundingClientRect().toJSON(),
    motionHidden: section.querySelector('[data-journey-motion-toggle]').hidden,
    packets: [...section.querySelectorAll('.journey-packet')].map(packet => ({
      display: getComputedStyle(packet).display,
      playState: getComputedStyle(packet).animationPlayState,
    })),
    connections: [...section.querySelectorAll('.journey-connection')].map(connection => connection.getBoundingClientRect().toJSON()),
    steps: [...section.querySelectorAll('[data-journey-step]')].map(step => ({
      title: step.querySelector('h3').textContent,
      active: step.hasAttribute('data-journey-active'),
      current: step.getAttribute('aria-current'),
      highlightOpacity: Number(getComputedStyle(step.querySelector('.journey-node'), '::before').opacity),
      box: step.getBoundingClientRect().toJSON(),
      nodeBox: step.querySelector('.journey-node').getBoundingClientRect().toJSON(),
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
const assertActive = (snapshot, index) => {
  assert.equal(snapshot.activeStep, index);
  assert.deepEqual(snapshot.steps.map(step => step.active), snapshot.steps.map((_, current) => current === index));
  assert.deepEqual(snapshot.steps.map(step => step.current), snapshot.steps.map((_, current) => current === index ? 'step' : null));
};
try {
  const progression = await browser.newPage({ width: 1440, height: 1000 });
  try {
    await ready(progression);
    await progression.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
    await sleep(50);
    for (const index of [0, 1, 2]) {
      await progression.eval(index => {
        const packets = [...document.querySelectorAll('#capabilities .journey-packet')];
        packets.flatMap(packet => packet.getAnimations()).forEach(animation => {
          animation.currentTime = Number(animation.effect.getTiming().duration) * (index + .15) / 3;
        });
        const toggle = document.querySelector('[data-journey-motion-toggle]');
        toggle.click();
      }, index);
      await sleep(50);
      await progression.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      await sleep(200);
      const snapshot = await state(progression);
      assertActive(snapshot, index);
      assert.deepEqual(snapshot.steps.map(step => step.highlightOpacity), [0, 1, 2].map(current => current === index ? 1 : 0), 'Only the active card is blue; all other cards stay neutral');
    }
    for (const [boundary, expected] of [[1, 1], [2, 2], [3, 0]]) {
      await progression.eval(boundary => {
        [...document.querySelectorAll('#capabilities .journey-packet')].flatMap(packet => packet.getAnimations()).forEach(animation => {
          animation.currentTime = Number(animation.effect.getTiming().duration) * boundary / 3 - 180;
        });
        document.querySelector('[data-journey-motion-toggle]').click();
      }, boundary);
      await sleep(320);
      await progression.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      assertActive(await state(progression), expected);
      await sleep(220);
      assertActive(await state(progression), expected);
    }
    results.progression = 'Single blue card follows the packet clock through all three stages and wraps to the first; pause preserves the active stage';
    console.log('Progressive highlight, exclusive blue state, packet synchronization, loop and pause: passed');
  } finally { await progression.close(); }

  // Capture only after playback checks. captureBeyondViewport can disturb the
  // intersection observer's viewport, so each staged capture uses a fresh page.
  for (const index of [0, 1, 2]) {
    const preview = await browser.newPage({ width: 1440, height: 1000 });
    try {
      await ready(preview);
      await preview.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      await sleep(50);
      await preview.eval(index => {
        [...document.querySelectorAll('#capabilities .journey-packet')].flatMap(packet => packet.getAnimations()).forEach(animation => {
          animation.currentTime = Number(animation.effect.getTiming().duration) * (index + .15) / 3;
        });
        document.querySelector('[data-journey-motion-toggle]').click();
      }, index);
      await sleep(50);
      await preview.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      await sleep(200);
      assertActive(await state(preview), index);
      await capture(preview, `1440-stage-${index + 1}.jpg`);
    } finally { await preview.close(); }
  }

  for (const [width, height] of [[1440, 1000], [1024, 1000], [768, 1024], [390, 844], [320, 740]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 });
    try {
      await ready(page);
      const initial = await state(page);
      assert.equal(initial.overflow, 0, 'The page must not overflow horizontally');
      assert.deepEqual(initial.steps.map(step => step.title), ['Descoberta', 'Atendimento', 'Acompanhamento']);
      initial.steps.forEach((step, index) => {
        if (width >= 640) {
          assert.ok(Math.abs(step.box.top - initial.steps[0].box.top) < 1, 'Larger screens keep one horizontal row');
        } else {
          assert.ok(Math.abs(step.box.left - initial.steps[0].box.left) < 1, 'Mobile cards share a vertical axis');
          assert.ok(step.nodeBox.width > step.nodeBox.height, 'Mobile cards retain a horizontal shape');
          if (index) assert.ok(step.box.top > initial.steps[index - 1].box.bottom, 'Mobile steps flow downward without overlap');
        }
        assert.ok(step.titleBox.left >= step.box.left && step.titleBox.right <= step.box.right + 1);
        assert.ok(step.copyBox.right <= step.box.right + 1 && step.copyBox.bottom <= step.box.bottom + 1);
      });
      assert.equal(initial.navigationHidden, initial.maximum <= 1);
      if (width < 640) {
        assert.equal(initial.maximum, 0, 'All mobile steps are available without horizontal scrolling');
        assert.equal(initial.tabbable, -1, 'A static vertical list is not an extra tab stop');
        initial.connections.forEach((connection, index) => {
          assert.equal(connection.width, 2);
          assert.ok(connection.height >= 32, 'Downward connectors have room for motion');
          assert.ok(Math.abs(connection.top - initial.steps[index].box.bottom) < 1);
          assert.ok(Math.abs(connection.bottom - initial.steps[index + 1].box.top) < 1);
        });
        await page.eval(() => {
          document.querySelector('[data-journey-motion-toggle]').click();
          const animation = document.querySelector('.journey-packet').getAnimations()[0];
          animation.currentTime = Number(animation.effect.getTiming().duration) * .15;
        });
        const packet = await page.eval(() => {
          const matrix = new DOMMatrix(getComputedStyle(document.querySelector('.journey-packet')).transform);
          return { x: matrix.m41, y: matrix.m42 };
        });
        assert.ok(Math.abs(packet.x) < .1 && packet.y > 0, 'Mobile flow animation travels down, not sideways');
        await page.eval(() => document.querySelector('[data-journey-motion-toggle]').click());
      }
      assert.equal(initial.motion, 'playing');
      assert.equal(initial.steps.filter(step => step.active).length, 1);
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
        assertActive(middle, 1);
        assert.equal(middle.motion, 'paused', 'Manual navigation must hold the selected stage for reading');
        await page.eval(() => document.querySelector('[data-journey-scroll]').focus({ preventScroll: true }));
        await key(page, 'End', 35);
        const end = await state(page);
        assert.ok(Math.abs(end.scroll - end.maximum) < 2);
        assert.equal(end.nextDisabled, true);
        assert.equal(end.position, 'Etapa 3 de 3');
        assertActive(end, 2);
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
      results[width] = `${width < 640 ? 'Vertical flow with horizontal cards' : 'Horizontal row'}, copy fit, navigation, motion and page containment passed`;
      console.log(`${width}px: ${width < 640 ? 'vertical' : 'horizontal'} journey passed`);
    } finally { await page.close(); }
  }

  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await reduced.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await ready(reduced);
    const initial = await state(reduced);
    assert.equal(initial.motionHidden, true);
    assert.equal(initial.motion, 'paused');
    assertActive(initial, 0);
    assert.ok(initial.packets.every(packet => packet.display === 'none'));
    assert.equal(initial.maximum, 0);
    assert.equal(initial.navigationHidden, true);
    initial.steps.forEach((step, index) => {
      if (index) assert.ok(step.box.top > initial.steps[index - 1].box.bottom);
    });
    await capture(reduced, '390-reduced-motion.jpg');
    results.reducedMotion = 'No animated packets; all three mobile steps remain in natural vertical reading order';
  } finally { await reduced.close(); }

  const noScript = await browser.newPage({ width: 390, height: 844, mobile: true });
  try {
    await noScript.send('Emulation.setScriptExecutionDisabled', { value: true });
    await ready(noScript);
    const initial = await state(noScript);
    assert.equal(initial.navigationHidden, true);
    assert.equal(initial.motionHidden, true);
    assert.ok(initial.packets.every(packet => packet.display === 'none'));
    assert.equal(initial.maximum, 0);
    initial.steps.forEach((step, index) => {
      if (index) assert.ok(step.box.top > initial.steps[index - 1].box.bottom);
    });
    await noScript.eval(() => {
      const viewport = document.querySelector('[data-journey-scroll]');
      viewport.scrollLeft = viewport.scrollWidth;
    });
    await sleep(100);
    assert.ok(Math.abs((await state(noScript)).scroll - initial.maximum) < 2);
    await capture(noScript, '390-no-js-last.jpg');
    results.noScript = 'All three mobile steps readable vertically without JavaScript or horizontal scrolling';
  } finally { await noScript.close(); }
  writeFileSync(resolve(output, 'checks.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
