export function initHeroVideo() {
  const heroVideo = document.querySelector('.hero-video');
  const videoToggle = document.querySelector('.hero-video-toggle');
  if (!heroVideo || !videoToggle) return;

  const label = videoToggle.querySelector('span');
  const icon = videoToggle.querySelector('path');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileHero = window.matchMedia('(max-width: 1020px)');
  let playbackIntent = 'auto';
  let inViewport = true;
  let pendingPlay = null;

  const syncVideoPoster = () => {
    const poster = mobileHero.matches ? heroVideo.dataset.mobilePoster : heroVideo.dataset.desktopPoster;
    if (heroVideo.getAttribute('poster') !== poster) heroVideo.poster = poster;
  };
  const syncVideoFrame = () => {
    heroVideo.toggleAttribute('data-video-ready', heroVideo.readyState >= 2 && !heroVideo.error);
  };
  const syncVideoButton = () => {
    const unavailable = Boolean(heroVideo.error);
    const text = unavailable ? 'Vídeo indisponível' : heroVideo.paused ? 'Reproduzir vídeo' : 'Pausar vídeo';
    if (label.textContent !== text) {
      label.textContent = text;
      icon.setAttribute('d', heroVideo.paused ? 'M7 4l9 6-9 6Z' : 'M6 4v12M14 4v12');
    }
    if (videoToggle.disabled !== unavailable) videoToggle.disabled = unavailable;
  };
  const syncPlayback = () => {
    const shouldPlay = playbackIntent !== 'pause'
      && (!reducedMotion.matches || playbackIntent === 'play')
      && !document.hidden && inViewport && !heroVideo.error;
    if (heroVideo.autoplay !== shouldPlay) heroVideo.autoplay = shouldPlay;
    if (!shouldPlay) {
      pendingPlay = null;
      heroVideo.pause();
    } else if (heroVideo.paused && !pendingPlay) {
      const request = heroVideo.play();
      pendingPlay = request;
      request.catch(syncVideoButton).finally(() => {
        if (pendingPlay === request) pendingPlay = null;
      });
    }
    syncVideoButton();
  };

  syncVideoPoster();
  syncVideoFrame();
  for (const event of ['loadeddata', 'error', 'emptied']) heroVideo.addEventListener(event, syncVideoFrame);
  for (const event of ['play', 'pause', 'error', 'emptied']) heroVideo.addEventListener(event, syncVideoButton);
  videoToggle.addEventListener('click', () => {
    playbackIntent = !heroVideo.paused || pendingPlay ? 'pause' : 'play';
    syncPlayback();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && playbackIntent === 'play') playbackIntent = 'auto';
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  mobileHero.addEventListener('change', () => {
    syncVideoPoster();
    pendingPlay = null;
    heroVideo.load();
    syncPlayback();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (inViewport === entry.isIntersecting) return;
      inViewport = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(heroVideo.closest('.hero'));
  }
  videoToggle.hidden = false;
  syncPlayback();
}
