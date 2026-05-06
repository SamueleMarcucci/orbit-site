(() => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = [...document.querySelectorAll("main section[id]")];

  const setActiveLink = () => {
    const current = sections
      .map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 84) }))
      .sort((a, b) => a.top - b.top)[0]?.id;

    navLinks.forEach((link) => {
      link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();
})();
