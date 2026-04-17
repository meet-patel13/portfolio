const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id], header[id]");
const scrollProgress = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const interactiveCards = document.querySelectorAll(".magnetic-card, .project-card");

const updateScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navAnchors.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.transform = `translate3d(${event.clientX - 180}px, ${event.clientY - 180}px, 0)`;
  });

  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);

    if (window.matchMedia("(pointer: fine)").matches) {
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--x");
    card.style.removeProperty("--y");
    card.style.transform = "";
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const sectionId = entry.target.getAttribute("id");
        navAnchors.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}
