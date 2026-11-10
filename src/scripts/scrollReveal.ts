// Fallback for the scroll reveal in browsers without CSS view timelines (Firefox, Safari):
// the same fade in, driven by an IntersectionObserver. Blocks already on screen are marked
// revealed before the class goes on, so nothing visible jumps, and reduced motion opts out.

const BLOCKS = `:is(main > section:not(:first-child), main > section:first-child > :not(:first-child), main [data-reveal], main :is(h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figure, figcaption, img, label, input, select, textarea, summary, button, .btn, .action-link, .icon-btn, .chip, .badge)):not(main > section:first-child > :first-child, main > section:first-child > :first-child *, p *, .quote-select-list, .quote-select-list *, [role="option"])`;

let observer: IntersectionObserver | undefined;

function initScrollReveal() {
  observer?.disconnect();
  const root = document.documentElement;
  root.classList.remove("reveal-js");
  if (CSS.supports("animation-timeline: view()")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const blocks = Array.from(document.querySelectorAll<HTMLElement>(BLOCKS));
  const pending = blocks.filter((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.dataset.revealed = "";
      return false;
    }
    return true;
  });

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = "";
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  pending.forEach((el) => observer!.observe(el));
  root.classList.add("reveal-js");
}

document.addEventListener("astro:page-load", initScrollReveal);

export {};
