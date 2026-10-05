function initDisclosures() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll<HTMLDetailsElement>("[data-disclosure]").forEach((disclosure) => {
    const summary = disclosure.querySelector("summary");
    const content = disclosure.querySelector<HTMLElement>("[data-disclosure-content]");
    if (!summary || !content || disclosure.dataset.disclosureReady) return;

    disclosure.dataset.disclosureReady = "true";
    let closing = false;
    let animation: Animation | undefined;

    summary.addEventListener("click", (event) => {
      if (reducedMotion || !disclosure.open || closing) return;

      event.preventDefault();
      closing = true;
      content.inert = true;
      animation?.cancel();

      animation = content.animate(
        [
          { height: `${content.offsetHeight}px`, opacity: 1 },
          { height: "0px", opacity: 0 },
        ],
        { duration: 180, easing: "ease-in", fill: "forwards" }
      );

      animation.finished
        .then(() => {
          disclosure.open = false;
          content.inert = false;
        })
        .catch(() => undefined)
        .finally(() => {
          closing = false;
        });
    });

    disclosure.addEventListener("toggle", () => {
      if (reducedMotion || !disclosure.open || closing) return;

      animation?.cancel();
      animation = content.animate(
        [
          { height: "0px", opacity: 0 },
          { height: `${content.scrollHeight}px`, opacity: 1 },
        ],
        { duration: 220, easing: "ease-out" }
      );

      animation.finished
        .then(() => {
          content.style.height = "";
          content.style.opacity = "";
        })
        .catch(() => undefined);
    });
  });
}

document.addEventListener("astro:page-load", initDisclosures);
