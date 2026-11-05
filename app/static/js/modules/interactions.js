// Input modality changes only on deliberate input, never on mousemove/scroll.
export function initInteractions() {
  const root = document.documentElement;
  const navigationKeys = new Set(['Tab', 'Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);
  const setInput = (input) => {
    if (root.dataset.input !== input) root.dataset.input = input;
  };

  document.addEventListener('keydown', (event) => {
    if (!event.ctrlKey && !event.metaKey && !event.altKey && navigationKeys.has(event.key)) setInput('keyboard');
  }, { capture: true });
  document.addEventListener('pointerdown', () => setInput('pointer'), { capture: true, passive: true });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!link || !link.hash) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target || !target.hasAttribute('tabindex')) return;
    // Leave URL/history/scroll to the native anchor. Move focus without a second scroll.
    target.focus({ preventScroll: true });
  });
}
