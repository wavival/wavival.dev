/** Opens the ecosystem part a link or the URL hash points to, so `#docs` never lands on a closed panel. */
function openPart(id: string, scroll: boolean) {
  if (!id) return;
  const target = document.getElementById(decodeURIComponent(id));
  const part = target?.closest<HTMLDetailsElement>("details[data-part]");
  if (!target || !part) return;
  if (!part.open) part.open = true;
  if (scroll && target === part) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    part.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
}

document.addEventListener("astro:page-load", () => openPart(location.hash.slice(1), false));
window.addEventListener("hashchange", () => openPart(location.hash.slice(1), false));

// A link to the hash already in the URL fires no hashchange, so handle the click too.
document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (link) openPart(link.getAttribute("href")!.slice(1), true);
});
