// Keep the chosen channel open until another card, an outside press or Escape.
export function initCardStack() {
  document.querySelectorAll('[data-card-stack]').forEach((stack) => {
    const cards = [...stack.querySelectorAll('[data-stack-card]')];
    const labels = cards.map(card => card.querySelector('.solution-card-label'));
    let selected = null;
    let frame = 0;

    const select = (card) => {
      selected = card;
      if (card) stack.dataset.active = String(cards.indexOf(card));
      else delete stack.dataset.active;
      cards.forEach((item) => item.setAttribute('aria-pressed', String(item === card)));
    };

    const layout = () => {
      frame = 0;
      // Probe the original geometry before choosing a readable static presentation.
      delete stack.dataset.stackStatic;
      const fits = labels.every(label => {
        const lines = [...label.children];
        const gap = parseFloat(getComputedStyle(label).rowGap) || 0;
        return lines.every(line => line.scrollWidth <= label.clientWidth + 1)
          && lines.reduce((height, line) => height + line.offsetHeight, gap) <= label.clientHeight + 1;
      });
      if (!fits) {
        if (cards.includes(document.activeElement)) stack.closest('section').querySelector('a')?.focus({ preventScroll: true });
        select(null);
        stack.dataset.stackStatic = '';
      }
      cards.forEach(card => { card.disabled = !fits; });
    };
    const scheduleLayout = () => { if (!frame) frame = requestAnimationFrame(layout); };

    cards.forEach((card) => {
      card.addEventListener('click', () => select(selected === card ? null : card));
    });

    stack.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !selected) return;
      event.preventDefault();
      event.stopPropagation();
      select(null);
    });

    document.addEventListener('pointerdown', (event) => {
      if (selected && !stack.contains(event.target)) select(null);
    }, { passive: true });
    const resize = new ResizeObserver(scheduleLayout);
    resize.observe(stack);
    labels.forEach(label => [...label.children].forEach(line => resize.observe(line)));
    document.fonts.ready.then(scheduleLayout);
    document.fonts.addEventListener('loadingdone', scheduleLayout);
    layout();
  });
}
