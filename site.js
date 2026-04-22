// Update --stars-offset on scroll so the star layers parallax.
(() => {
  const root = document.documentElement;
  let ticking = false;

  const sync = () => {
    root.style.setProperty("--stars-offset", `${window.scrollY}px`);
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
