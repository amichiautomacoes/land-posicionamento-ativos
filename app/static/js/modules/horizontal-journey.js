export function initHorizontalJourney() {
  const journey = document.querySelector('[data-customer-journey]');
  if (!journey) return;
  const viewport = journey.querySelector('[data-journey-scroll]');
  const steps = [...journey.querySelectorAll('[data-journey-step]')];
  const navigation = journey.querySelector('[data-journey-navigation]');
  const previous = journey.querySelector('[data-journey-previous]');
  const next = journey.querySelector('[data-journey-next]');
  const position = journey.querySelector('[data-journey-position]');
  const toggle = journey.querySelector('[data-journey-motion-toggle]');
  const packets = [...journey.querySelectorAll('.journey-packet')];
  if (!viewport || !steps.length || !navigation || !previous || !next || !position || !toggle) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let visible = false;
  let current = 0;
  let requested = null;
  let frame = 0;
  let active = 0;
  let progressTimer = 0;

  const highlight = index => {
    active = index;
    journey.dataset.activeStep = String(index);
    steps.forEach((step, current) => {
      const selected = current === index;
      step.toggleAttribute('data-journey-active', selected);
      if (selected) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };
  const packetAnimations = () => packets.flatMap(packet => packet.getAnimations());
  const seek = index => {
    packetAnimations().forEach(animation => {
      animation.currentTime = Number(animation.effect.getTiming().duration) * index / steps.length;
    });
    highlight(index);
  };
  const scrollToStep = index => {
    requested = index;
    const instant = reducedMotion.matches || document.documentElement.dataset.input === 'keyboard';
    viewport.scrollTo({ left: steps[index].offsetLeft - steps[0].offsetLeft, behavior: instant ? 'instant' : 'smooth' });
  };
  const syncProgress = () => {
    clearTimeout(progressTimer);
    if (journey.dataset.motion !== 'playing') return;
    // Read the existing packet animation's clock so highlights cannot drift
    // away from the connections. No per-frame JavaScript or independent loop.
    const clock = packets[0]?.getAnimations()[0];
    if (!clock) return;
    const duration = Number(clock.effect.getTiming().duration);
    if (!Number.isFinite(duration) || duration <= 0) return;
    const elapsed = Number(clock.currentTime ?? 0) % duration;
    const interval = duration / steps.length;
    const index = Math.min(steps.length - 1, Math.floor(elapsed / interval));
    if (index !== active) {
      highlight(index);
      if (viewport.scrollWidth > viewport.clientWidth + 1) scrollToStep(index);
    }
    progressTimer = setTimeout(syncProgress, Math.max(24, interval - elapsed % interval + 16));
  };

  const syncMotion = () => {
    journey.dataset.motion = !paused && visible && !reducedMotion.matches && !document.hidden ? 'playing' : 'paused';
    // Automatic playback must not repeatedly announce the position counter.
    position.setAttribute('aria-live', journey.dataset.motion === 'playing' ? 'off' : 'polite');
    if (reducedMotion.matches && document.activeElement === toggle) journey.closest('section').focus({ preventScroll: true });
    toggle.hidden = reducedMotion.matches;
    const label = paused ? 'Retomar movimento' : 'Pausar movimento';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.querySelector('[data-journey-pause-icon]').toggleAttribute('hidden', paused);
    toggle.querySelector('[data-journey-play-icon]').toggleAttribute('hidden', !paused);
    syncProgress();
  };
  const syncNavigation = () => {
    frame = 0;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const overflow = maxScroll > 1;
    if (!overflow && navigation.contains(document.activeElement)) journey.closest('section').focus({ preventScroll: true });
    navigation.hidden = !overflow;
    if (overflow) viewport.tabIndex = 0;
    else viewport.removeAttribute('tabindex');

    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    let distance = Infinity;
    steps.forEach((step, index) => {
      const delta = Math.abs(step.offsetLeft + step.offsetWidth / 2 - center);
      if (delta < distance) { distance = delta; current = index; }
    });
    if (requested !== null) {
      const destination = Math.min(maxScroll, steps[requested].offsetLeft - steps[0].offsetLeft);
      if (!overflow || Math.abs(viewport.scrollLeft - destination) <= 1) requested = null;
    }
    previous.disabled = requested === null ? viewport.scrollLeft <= 1 : requested === 0;
    next.disabled = requested === null ? viewport.scrollLeft >= maxScroll - 1 : requested === steps.length - 1;
    position.textContent = `Etapa ${current + 1} de ${steps.length}`;
    if (overflow && (paused || reducedMotion.matches)) {
      const selected = requested ?? current;
      if (selected !== active) seek(selected);
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(syncNavigation); };
  const goTo = index => {
    const selected = Math.max(0, Math.min(steps.length - 1, index));
    // A manual choice holds its card for reading until playback is resumed.
    paused = true;
    seek(selected);
    syncMotion();
    scrollToStep(selected);
    syncNavigation();
  };

  const releaseRequest = () => { requested = null; schedule(); };
  previous.addEventListener('click', () => goTo((requested ?? current) - 1));
  next.addEventListener('click', () => goTo((requested ?? current) + 1));
  viewport.addEventListener('scroll', schedule, { passive: true });
  viewport.addEventListener('scrollend', releaseRequest);
  const holdForInteraction = () => {
    paused = true;
    requested = null;
    syncMotion();
    syncNavigation();
  };
  viewport.addEventListener('pointerdown', holdForInteraction, { passive: true });
  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) holdForInteraction();
    else releaseRequest();
  }, { passive: true });
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || event.ctrlKey || event.metaKey || event.altKey) return;
    let target;
    if (event.key === 'ArrowRight') target = (requested ?? current) + 1;
    if (event.key === 'ArrowLeft') target = (requested ?? current) - 1;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = steps.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    goTo(target);
  });
  toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) seek(active);
    syncMotion();
  });
  document.addEventListener('visibilitychange', syncMotion);
  new ResizeObserver(releaseRequest).observe(viewport);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }, { threshold: .05 }).observe(journey);
  journey.dataset.journeyReady = '';
  syncNavigation();
  syncMotion();
  document.fonts.ready.then(schedule);
}
