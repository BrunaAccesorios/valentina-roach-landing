const routineSteps = [...document.querySelectorAll("[data-routine-step]")];
const routineVideos = [...document.querySelectorAll("[data-routine-video]")];
const routineCurrent = document.querySelector("[data-routine-current]");
const routineSection = document.querySelector(".routine");
const routineProgress = document.querySelector("[data-routine-progress]");

if (routineSection && routineSteps.length && routineCurrent) {
  let currentIndex = -1;

  const setScene = (index) => {
    if (index === currentIndex) return;
    currentIndex = index;

    routineSteps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === index);
    });

    routineVideos.forEach((video, videoIndex) => {
      const isActive = videoIndex === index;
      video.classList.toggle("is-active", isActive);
      if (isActive) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    routineCurrent.textContent = String(index + 1).padStart(2, "0");
  };

  const updateRoutine = () => {
    const rect = routineSection.getBoundingClientRect();
    const scrollable = routineSection.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    const index = Math.min(routineSteps.length - 1, Math.floor(progress * routineSteps.length));

    setScene(index);
    if (routineProgress) {
      routineProgress.style.transform = `scaleX(${progress})`;
    }
  };

  updateRoutine();
  window.addEventListener("scroll", updateRoutine, { passive: true });
  window.addEventListener("resize", updateRoutine);
}

document.querySelectorAll("[data-card-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-tech-card]");
    const isFlipped = card.classList.toggle("is-flipped");
    const front = card.querySelector(".glass-card__front");
    const back = card.querySelector(".glass-card__back");

    card.querySelectorAll("[data-card-toggle]").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(isFlipped));
    });

    front.setAttribute("aria-hidden", String(isFlipped));
    back.setAttribute("aria-hidden", String(!isFlipped));
    front.toggleAttribute("inert", isFlipped);
    back.toggleAttribute("inert", !isFlipped);
  });
});

const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const siteHeader = document.querySelector("[data-site-header]");

if (navToggle && siteNav && siteHeader) {
  const closeNavigation = () => {
    siteHeader.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  const navigationLinks = [...siteNav.querySelectorAll("a")];
  const observedSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!current) return;

      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${current.target.id}`;
        link.toggleAttribute("aria-current", isCurrent);
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}
