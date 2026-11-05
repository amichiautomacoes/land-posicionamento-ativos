// The reference's rotating window, counter-rotated images and vertical scroll rail.
// Scroll only schedules a frame while this section is near the viewport; geometry
// is cached on resize, never measured on each scroll frame.
export function initProcessRail() {
  const rail = document.querySelector('[data-process-rail]');
  if (!rail || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;

  const visual = rail.querySelector('[data-rail-visual]');
  const imageWindow = rail.querySelector('[data-rail-window]');
  const path = rail.querySelector('[data-rail-path]');
  const progress = rail.querySelector('[data-rail-progress]');
  const steps = [...rail.querySelectorAll('[data-rail-step]')];
  const images = steps.map(step => step.querySelector('[data-rail-image]'));
  const responsiveImages = images.map(figure => figure?.querySelector('img[data-rail-sizes]')).filter(Boolean);
  const staticSizes = new Map(responsiveImages.map(image => [image, image.getAttribute('sizes')]));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!visual || !imageWindow || !path || !progress || steps.length < 2 || images.some(image => !image)) return;

  const clamp = value => Math.max(0, Math.min(1, value));
  let enabled = false;
  let observingScroll = false;
  let frame = 0;
  let geometry = null;
  let activeIndex = -1;

  const render = () => {
    frame = 0;
    if (!enabled || !geometry) return;
    const center = window.scrollY + window.innerHeight / 2;
    // Longer copy can give each solution a different height, especially on phones.
    let phase = 0;
    for (let index = 0; index < geometry.centers.length - 1; index++) {
      const start = geometry.centers[index];
      if (center >= start) phase = index + clamp((center - start) / (geometry.centers[index + 1] - start));
    }
    // The original holds its first square briefly, then turns 45° per stage.
    const turn = phase < 1 ? clamp((phase - .2) / .8) : phase;
    const angle = turn * 45;
    imageWindow.style.transform = `rotate(${angle}deg)`;
    images.forEach((image, index) => {
      image.style.transform = `rotate(${-angle}deg) scale(1.5)`;
      image.style.opacity = index === images.length - 1 ? '1' : String(1 - clamp((phase - index - .8) / .2));
    });
    progress.style.transform = `scaleY(${clamp((center - geometry.pathStart) / geometry.pathHeight)})`;

    const nextIndex = Math.min(images.length - 1, Math.floor(phase + .1));
    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
      rail.dataset.active = String(activeIndex);
      images.forEach((image, index) => image.setAttribute('aria-hidden', String(index !== activeIndex)));
    }
  };

  const schedule = () => {
    if (!frame && enabled) frame = window.requestAnimationFrame(render);
  };

  const measure = () => {
    if (!enabled) return;
    const track = path.getBoundingClientRect();
    geometry = {
      centers: steps.map(step => {
        const box = step.getBoundingClientRect();
        return box.top + window.scrollY + box.height / 2;
      }),
      pathStart: track.top + window.scrollY,
      pathHeight: Math.max(1, track.height),
    };
    schedule();
  };

  const setScrollObservation = (listen) => {
    if (observingScroll === listen) return;
    observingScroll = listen;
    if (listen) window.addEventListener('scroll', schedule, { passive: true });
    else window.removeEventListener('scroll', schedule);
  };

  const visibility = new IntersectionObserver(entries => {
    setScrollObservation(enabled && entries[0].isIntersecting);
    if (enabled && entries[0].isIntersecting) measure();
  }, { rootMargin: '100% 0px' });
  const resize = new ResizeObserver(measure);

  const configure = () => {
    if (reducedMotion.matches) {
      enabled = false;
      setScrollObservation(false);
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener('resize', measure);
      window.cancelAnimationFrame(frame);
      frame = 0;
      images.forEach((image, index) => {
        image.style.removeProperty('transform');
        image.style.removeProperty('opacity');
        image.removeAttribute('aria-hidden');
        steps[index].append(image);
      });
      responsiveImages.forEach(image => image.setAttribute('sizes', staticSizes.get(image)));
      delete rail.dataset.railReady;
      delete rail.dataset.active;
      imageWindow.style.removeProperty('transform');
      progress.style.removeProperty('transform');
      visual.hidden = true;
      path.hidden = true;
      activeIndex = -1;
      return;
    }

    // The rotating mask enlarges its contents 1.5x: include that in source selection.
    responsiveImages.forEach(image => image.setAttribute('sizes', image.dataset.railSizes));
    images.forEach(image => imageWindow.append(image));
    visual.hidden = false;
    path.hidden = false;
    rail.dataset.railReady = '';
    enabled = true;
    measure();
    visibility.observe(rail);
    resize.observe(rail);
    resize.observe(document.body);
    steps.forEach(step => resize.observe(step));
    window.addEventListener('resize', measure, { passive: true });
  };

  reducedMotion.addEventListener('change', configure);
  configure();
  document.fonts.ready.then(measure);
}
