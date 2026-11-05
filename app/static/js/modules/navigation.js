export function initNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation-content');
  if (!menuButton || !navigation) return;

  const mobileNavigation = window.matchMedia('(max-width: 1020px)');
  const firstLink = navigation.querySelector('a[href]');
  let isOpen = false;

  const setOpen = (open) => {
    if (isOpen === open) return;
    isOpen = open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
    navigation.hidden = mobileNavigation.matches && !open;
  };
  const syncMenu = () => {
    const focused = document.activeElement;
    const mobile = mobileNavigation.matches;
    if (!mobile) setOpen(false);
    menuButton.hidden = !mobile;
    navigation.hidden = mobile && !isOpen;
    // Resizing must not leave focus on an element that just became hidden.
    if (mobile && !isOpen && navigation.contains(focused)) menuButton.focus({ preventScroll: true });
    else if (!mobile && focused === menuButton) firstLink?.focus({ preventScroll: true });
  };

  syncMenu();
  mobileNavigation.addEventListener('change', syncMenu);
  menuButton.addEventListener('click', () => setOpen(!isOpen));
  navigation.addEventListener('click', (event) => {
    if (isOpen && event.target.closest('a[href]')) setOpen(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (isOpen && !navigation.contains(event.target) && !menuButton.contains(event.target)) setOpen(false);
  }, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen) return;
    setOpen(false);
    menuButton.focus({ preventScroll: true });
  });
}
