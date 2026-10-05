/** Opens the ecosystem part a link or the URL hash points to, so `#docs` never lands on a closed panel. */
function openPart(id: string, scroll: boolean) {
  if (!id) return;
  let key = id;
  try {
    key = decodeURIComponent(id);
  } catch {
    // A malformed escape in the hash: use it as typed.
  }
  const target = document.getElementById(key);
  const part = target?.closest<HTMLDetailsElement>("details[data-part]");
  if (!target || !part) return;
  const wasClosed = !part.open;
  if (wasClosed) part.open = true;
  // The browser could not scroll to a target that was hidden inside a closed part.
  if (scroll || wasClosed) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
}

document.addEventListener("astro:page-load", () => openPart(location.hash.slice(1), false));
window.addEventListener("hashchange", () => openPart(location.hash.slice(1), false));

// A link to the hash already in the URL fires no hashchange, so handle the click too.
document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (link) openPart(link.getAttribute("href")!.slice(1), true);
});
