// Parallax stars + nav collapse on scroll.
(() => {
  const root = document.documentElement;
  const body = document.body;
  let ticking = false;

  const sync = () => {
    const y = window.scrollY;
    root.style.setProperty("--stars-offset", `${y}px`);
    body.classList.toggle("is-scrolled", y > 24);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  sync();
})();
