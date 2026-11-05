export function initFaq() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-faq]').forEach((list) => {
    if (list.hasAttribute('data-faq-ready')) return;
    const items = [...list.querySelectorAll('[data-faq-item]')].map((element) => ({
      element,
      trigger: element.querySelector('[data-faq-trigger]'),
      answer: element.querySelector('[data-faq-answer]'),
      timer: null,
    }));
    if (!items.length || items.some(({ trigger, answer }) => !trigger || !answer)) return;

    const instant = () => reducedMotion.matches || document.documentElement.dataset.input === 'keyboard';
    const duration = getComputedStyle(list).getPropertyValue('--motion-enter').trim();
    const durationMs = parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000) || 220;

    const setOpen = (item, open, animate = true) => {
      clearTimeout(item.timer);
      item.timer = null;
      if (!open && item.answer.contains(document.activeElement)) item.trigger.focus({ preventScroll: true });
      item.trigger.setAttribute('aria-expanded', String(open));
      item.answer.inert = !open;
      item.answer.setAttribute('aria-hidden', String(!open));

      if (open) {
        const wasHidden = item.answer.hidden;
        item.answer.hidden = false;
        // Establish the collapsed starting box only when returning from display:none.
        if (animate && !instant() && wasHidden) item.answer.getBoundingClientRect();
        item.element.setAttribute('data-faq-open', '');
      } else {
        item.element.removeAttribute('data-faq-open');
        if (animate && !instant() && !item.answer.hidden) {
          item.timer = window.setTimeout(() => {
            item.answer.hidden = true;
            item.timer = null;
          }, durationMs);
        } else {
          item.answer.hidden = true;
        }
      }
    };

    items.forEach((item, index) => {
      item.trigger.disabled = false;
      setOpen(item, false, false);
      item.trigger.addEventListener('click', () => {
        const open = item.trigger.getAttribute('aria-expanded') !== 'true';
        items.forEach((other) => {
          if (other !== item && other.trigger.getAttribute('aria-expanded') === 'true') setOpen(other, false);
        });
        setOpen(item, open);
      });
      item.trigger.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        let destination;
        if (event.key === 'ArrowDown') destination = (index + 1) % items.length;
        if (event.key === 'ArrowUp') destination = (index - 1 + items.length) % items.length;
        if (event.key === 'Home') destination = 0;
        if (event.key === 'End') destination = items.length - 1;
        if (destination === undefined) return;
        event.preventDefault();
        items[destination].trigger.focus();
      });
    });
    list.setAttribute('data-faq-ready', '');

    reducedMotion.addEventListener('change', (event) => {
      if (!event.matches) return;
      items.forEach((item) => setOpen(item, item.trigger.getAttribute('aria-expanded') === 'true', false));
    });
  });
}
