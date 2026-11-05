export function initReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.removeAttribute('data-transition-pending');
        if (!reducedMotion.matches && document.documentElement.dataset.input !== 'keyboard') {
          entry.target.classList.add('reveal-arrive');
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      if (element.hasAttribute('data-section-transition')) element.setAttribute('data-transition-pending', '');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        observer.disconnect();
        document.querySelectorAll('[data-section-transition]').forEach((element) => {
          element.removeAttribute('data-transition-pending');
          element.classList.remove('reveal-arrive');
        });
      }
    });
  }

}
