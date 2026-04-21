const syncHeaderState = () => {
  document.body.classList.toggle("scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("load", syncHeaderState);
syncHeaderState();
