// Shows the back-to-top button once the page is scrolled one viewport down and hides it
// again near the top. Using it scrolls to the top (instantly with reduced motion) and moves
// the focus to the start of the main content, so keyboard users continue from there.

let listeners: AbortController | undefined;

function initBackToTop() {
  listeners?.abort();
  const wrap = document.querySelector<HTMLElement>("[data-back-to-top]");
  const button = wrap?.querySelector("button");
  const main = document.getElementById("main-content");
  if (!wrap || !button || !main) return;

  listeners = new AbortController();
  const { signal } = listeners;
  const update = () => {
    wrap.hidden = window.scrollY < window.innerHeight;
  };
  window.addEventListener("scroll", update, { passive: true, signal });
  window.addEventListener("resize", update, { passive: true, signal });
  update();

  button.addEventListener(
    "click",
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      main.focus({ preventScroll: true });
    },
    { signal }
  );
}

document.addEventListener("astro:page-load", initBackToTop);

export {};
