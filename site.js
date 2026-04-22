let lastScrollY = window.scrollY;
let ticking = false;
const revealTargets = [...document.querySelectorAll(".reveal-on-scroll")];
const parallaxCards = [...document.querySelectorAll(".parallax-card")];
const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll(".top-nav a, .mobile-menu a")];
const mqReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mqLowPower = window.matchMedia("(max-width: 900px)");
let revealObserver = null;

const revealIfReady = (target) => {
  if (target.classList.contains("is-visible")) return;
  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const entersViewport = rect.top <= viewportHeight * 0.92;
  const notFullyPast = rect.bottom >= viewportHeight * 0.08;

  if (entersViewport && notFullyPast) {
    target.classList.add("is-visible");
    if (revealObserver) {
      revealObserver.unobserve(target);
    }
  }
};

const syncRevealState = () => {
  revealTargets.forEach(revealIfReady);
};

const syncScrollState = () => {
  const currentScrollY = window.scrollY;
  document.body.classList.toggle("scrolled", currentScrollY > 8);
  document.body.classList.toggle("scrolling-down", currentScrollY > lastScrollY && currentScrollY > 16);
  document.documentElement.style.setProperty(
    "--stars-offset",
    mqLowPower.matches || mqReduceMotion.matches ? "0px" : `${currentScrollY}px`
  );

  if (!mqReduceMotion.matches && !mqLowPower.matches) {
    const viewportCenter = window.innerHeight * 0.5;
    parallaxCards.forEach((card) => {
      const speed = Number(card.dataset.speed || 0.06);
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height * 0.5;
      const distance = (cardCenter - viewportCenter) * speed;
      card.style.setProperty("--parallax-shift", `${distance.toFixed(2)}px`);
    });
  } else {
    parallaxCards.forEach((card) => {
      card.style.setProperty("--parallax-shift", "0px");
    });
  }

  syncRevealState();

  lastScrollY = currentScrollY;
  ticking = false;
};

const requestScrollSync = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(syncScrollState);
};

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!siteHeader.classList.contains("menu-open")) return;
      siteHeader.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

if (revealTargets.length) {
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: [0, 0.01, 0.15],
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = mqLowPower.matches ? "0ms" : `${index * 90}ms`;
      revealObserver.observe(target);
      revealIfReady(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }
}

window.addEventListener("scroll", requestScrollSync, { passive: true });
window.addEventListener("resize", requestScrollSync, { passive: true });
window.addEventListener("orientationchange", requestScrollSync, { passive: true });
mqLowPower.addEventListener("change", requestScrollSync);
mqReduceMotion.addEventListener("change", requestScrollSync);
window.addEventListener("load", requestScrollSync);
requestScrollSync();
