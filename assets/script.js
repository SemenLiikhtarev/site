(() => {
  "use strict";

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  const setHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* ---------- Mobile menu ---------- */
  const closeNav = () => {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("nav-open");
  };

  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("nav-open", open);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !burger.contains(event.target)) closeNav();
  });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    revealItems.forEach((el) => revealObserver.observe(el));
  }

  window.__revealReady = true;

  /* ---------- Active nav link ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const updateActiveLink = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = null;

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top + window.scrollY <= probe) {
          current = section;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", Boolean(current) && link.getAttribute("href") === `#${current.id}`);
      });
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
  }

  /* ---------- Subtle 3D tilt on avatar card ---------- */
  const avatarCard = document.getElementById("avatarCard");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (avatarCard && canHover && !reduceMotion) {
    const MAX_TILT = 7;

    avatarCard.addEventListener("pointermove", (event) => {
      const rect = avatarCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      avatarCard.style.transform = `perspective(900px) rotateX(${(-y * MAX_TILT).toFixed(2)}deg) rotateY(${(x * MAX_TILT).toFixed(2)}deg) translateY(-3px)`;
    });

    avatarCard.addEventListener("pointerleave", () => {
      avatarCard.style.transform = "";
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
