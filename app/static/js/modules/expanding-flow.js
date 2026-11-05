// Fixed text columns keep the copy still while transform/clip animations reveal media.
export function initExpandingFlow() {
  document.querySelectorAll('[data-expanding-flow]').forEach((row) => {
    const cards = [...row.querySelectorAll('[data-flow-step]')];
    const controls = cards.map((card) => card.querySelector('[data-flow-control]'));
    const surfaces = cards.map((card) => card.querySelector('.flow-step-surface'));
    const desktop = window.matchMedia('(min-width: 1021px)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const running = new Set();
    const styles = getComputedStyle(document.documentElement);
    const timing = {
      duration: parseFloat(styles.getPropertyValue('--motion-enter')) || 220,
      easing: styles.getPropertyValue('--ease-out').trim() || 'ease-out',
    };
    let active = 0;
    let enhanced = false;
    let layoutFrame = 0;
    let previousPointer;

    const cancel = () => {
      running.forEach((animation) => animation.cancel());
      running.clear();
    };
    const sync = () => {
      row.dataset.active = String(active);
      if (enhanced) {
        row.style.setProperty('--flow-columns', cards.map((_, index) => index === active ? '2fr' : '1fr').join(' '));
      } else {
        row.style.removeProperty('--flow-columns');
      }
      cards.forEach((card, index) => {
        card.dataset.expanded = String(enhanced && index === active);
        controls[index].hidden = !enhanced;
        controls[index].setAttribute('aria-pressed', String(enhanced && index === active));
      });
    };
    const animate = (element, frames) => {
      const animation = element.animate(frames, timing);
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    };
    const select = (index, motion = false) => {
      if (!enhanced || index === active) return;
      const shouldAnimate = motion && !reducedMotion.matches && typeof cards[0].animate === 'function';
      // Read current painted bounds before cancellation so fast reversals stay continuous.
      const before = shouldAnimate ? surfaces.map((surface) => surface.getBoundingClientRect()) : null;
      cancel();
      active = index;
      sync();
      if (!shouldAnimate) return;
      const after = cards.map((card) => card.getBoundingClientRect());
      const radius = getComputedStyle(cards[0]).borderTopLeftRadius;
      cards.forEach((card, current) => {
        const from = before[current];
        const to = after[current];
        animate(card, [
          { transform: `translateX(${from.left - to.left}px)`, clipPath: `inset(0 ${to.width - from.width}px 0 0 round ${radius})` },
          { transform: 'translateX(0)', clipPath: `inset(0 0px 0 0 round ${radius})` },
        ]);
        animate(surfaces[current], [
          { transform: `scaleX(${from.width / to.width})` },
          { transform: 'scaleX(1)' },
        ]);
      });
    };
    const layout = () => {
      layoutFrame = 0;
      const width = row.getBoundingClientRect().width;
      cancel();
      enhanced = desktop.matches;
      delete row.dataset.flowStatic;
      if (enhanced) {
        const gap = parseFloat(getComputedStyle(row).columnGap);
        row.style.setProperty('--flow-unit', `${(width - gap * (cards.length - 1)) / (cards.length + 1)}px`);
        row.dataset.flowReady = 'true';
        sync();
        // Read natural text bounds; enlarged text must never remain behind the mask.
        enhanced = cards.every(card => {
          const text = card.querySelector('.flow-step-text');
          const copy = card.querySelector('.flow-step-copy');
          const preview = card.querySelector('.flow-step-preview');
          const padding = parseFloat(getComputedStyle(copy).paddingBottom);
          const bottom = Math.min(copy.getBoundingClientRect().bottom, card.getBoundingClientRect().bottom);
          return text.getBoundingClientRect().bottom <= bottom - padding + 1
            && (!preview || preview.getBoundingClientRect().bottom <= text.getBoundingClientRect().top - 1)
            && text.scrollWidth <= text.clientWidth + 1;
        });
        if (!enhanced) row.dataset.flowStatic = '';
      }
      if (!enhanced) {
        if (controls.includes(document.activeElement)) row.closest('section').focus({ preventScroll: true });
        delete row.dataset.flowReady;
        row.style.removeProperty('--flow-unit');
      }
      // Only the enhanced desktop layout has a tall image panel. Static cards
      // retain the square/wide artwork, including without JavaScript.
      cards.forEach(card => {
        const source = card.querySelector('[data-flow-desktop-source]');
        const media = enhanced ? '(min-width: 1021px)' : 'not all';
        if (source && source.media !== media) source.media = media;
      });
      sync();
    };
    const scheduleLayout = () => { if (!layoutFrame) layoutFrame = requestAnimationFrame(layout); };

    // React to actual pointer travel, not enter events caused by a moving card.
    row.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches) return;
      if (previousPointer?.x === event.clientX && previousPointer?.y === event.clientY) return;
      previousPointer = { x: event.clientX, y: event.clientY };
      const keyboardFocus = row.contains(document.activeElement) && document.documentElement.dataset.input === 'keyboard';
      if (keyboardFocus) return;
      const card = event.target instanceof Element ? event.target.closest('[data-flow-step]') : null;
      const index = cards.indexOf(card);
      if (index !== -1) select(index, true);
    }, { passive: true });
    row.addEventListener('pointerleave', () => { previousPointer = undefined; });

    cards.forEach((card, index) => {
      controls[index].addEventListener('focus', () => select(index, document.documentElement.dataset.input === 'pointer'));
      controls[index].addEventListener('click', (event) => select(index, event.detail > 0));
      controls[index].addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % cards.length;
        if (event.key === 'ArrowLeft') next = (index + cards.length - 1) % cards.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = cards.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        controls[next].focus({ preventScroll: true });
      });
    });
    desktop.addEventListener('change', scheduleLayout);
    reducedMotion.addEventListener('change', (event) => { if (event.matches) cancel(); });
    const resize = new ResizeObserver(scheduleLayout);
    resize.observe(row);
    cards.forEach(card => {
      resize.observe(card.querySelector('.flow-step-text'));
      resize.observe(card.querySelector('.flow-step-number'));
    });
    document.fonts.ready.then(scheduleLayout);
    document.fonts.addEventListener('loadingdone', scheduleLayout);
    layout();
  });
}
