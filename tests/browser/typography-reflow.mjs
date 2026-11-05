import { Browser, sleep } from './support/browser-env.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const output = resolve('reports/qa/apple-design-fixes-2026-11-04/reflow');
mkdirSync(output, { recursive: true });
const browser = await Browser.launch();
const results = [];
const measure = () => ({
  viewport: innerWidth,
  overflow: document.documentElement.scrollWidth - innerWidth,
  benefits: [...document.querySelectorAll('[data-flow-step]')].map(card => {
    const text = card.querySelector('.flow-step-text'), box = card.getBoundingClientRect(), copy = text.getBoundingClientRect();
    return { title:card.querySelector('h3').textContent, horizontal:text.scrollWidth-text.clientWidth, bottom:copy.bottom-box.bottom, right:copy.right-box.right };
  }),
  stack: [...document.querySelectorAll('.solution-card')].map(card => {
    const face = card.querySelector('.solution-card-face').getBoundingClientRect();
    return [...card.querySelectorAll('.solution-card-title,.solution-card-description')].map(text => {
      const range=document.createRange(); range.selectNodeContents(text); const box=range.getBoundingClientRect();
      return {text:text.textContent, right:box.right-face.right, left:face.left-box.left, bottom:box.bottom-face.bottom};
    });
  }),
  interactiveFlow:document.querySelector('[data-expanding-flow]').hasAttribute('data-flow-ready'),
  interactiveStack:[...document.querySelectorAll('.solution-card')].some(card=>!card.disabled),
  journey:[...document.querySelectorAll('.journey-node-label')].map(label=>({
    title:label.querySelector('h3').textContent,
    horizontal:label.scrollWidth-label.clientWidth,
  })),
});
try {
  for (const width of [1440, 1021, 768, 390, 320]) {
    const page = await browser.newPage({width,height:900,mobile:width<600});
    try {
      await page.goto('http://127.0.0.1:5017/', {settleMs:300});
      await page.eval(async()=>{await document.fonts.ready;document.querySelector('video').pause();});
      const initial=await page.eval(measure);
      assert.equal(initial.overflow,0);
      assert.equal(initial.interactiveFlow,width>1020);
      assert.equal(initial.interactiveStack,true);
      await page.eval(desktop=>document.querySelector(desktop?'[data-flow-control]':'.solution-card').focus({preventScroll:true}),width>1020);
      await page.eval(()=>{document.documentElement.style.fontSize='200%';});
      await sleep(400);
      const enlarged=await page.eval(measure);
      enlarged.benefits.forEach(card=>{
        assert.ok(card.horizontal<=1,`${width}px: ${card.title} overflows horizontally`);
        assert.ok(card.bottom<=1,`${width}px: ${card.title} is clipped vertically`);
        assert.ok(card.right<=1,`${width}px: ${card.title} is clipped horizontally`);
      });
      enlarged.stack.flat().forEach(text=>{
        assert.ok(text.right<=1 && text.left<=1 && text.bottom<=1,`${width}px: ${text.text} leaves its card`);
      });
      enlarged.journey.forEach(label=>assert.ok(label.horizontal<=1,`${width}px: ${label.title} leaves its journey node`));
      assert.equal(enlarged.overflow,0,`${width}px: enlarged text must not widen the page`);
      assert.ok(enlarged.viewport<=width+1,`${width}px: mobile viewport must not expand to hide overflow`);
      assert.equal(await page.eval(()=>Boolean(document.activeElement.disabled || document.activeElement.closest('[hidden]'))),false,'Focus must remain on a visible, enabled destination');
      for(const selector of ['#capabilities-copy','.solution-stack']) {
        await page.eval(selector=>document.querySelector(selector).scrollIntoView({behavior:'instant',block:'start'}),selector);
        await sleep(250);
        await page.screenshot({path:resolve(output,`${width}-${selector==='.solution-stack'?'stack':'benefits'}-200.jpg`),quality:88});
      }
      await page.eval(()=>{document.documentElement.style.fontSize='';});
      await sleep(400);
      const restored=await page.eval(measure);
      assert.equal(restored.interactiveFlow,initial.interactiveFlow,'Restoring text size must restore the expanding cards');
      assert.equal(restored.interactiveStack,true,'Restoring text size must restore the stack');
      assert.equal(restored.overflow,0);
      assert.deepEqual(page.consoleErrors,[]);
      results.push({width,initial,enlarged,restored});
      console.log(`${width}px: 200% text fits; original interactions restored`);
    } finally {await page.close();}
  }
  writeFileSync(resolve(output,'verification.json'),JSON.stringify(results,null,2));
} finally {await browser.close();}
