// Elements are queried at call time, not captured once: with View Transitions the
// NavBar is replaced on each navigation, so cached references would go stale.
function el(id: string) {
  return document.getElementById(id);
}

function getFocusable(): HTMLElement[] {
  const menu = el("mobile-menu");
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
}

function labels() {
  const btn = el("menu-btn");
  return {
    open: btn?.dataset.labelOpen ?? "Abrir menú de navegación",
    close: btn?.dataset.labelClose ?? "Cerrar menú de navegación",
  };
}

function openMenu() {
  const menu = el("mobile-menu");
  const btn = el("menu-btn");
  menu?.removeAttribute("inert");
  menu?.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
  el("icon-open")?.classList.add("hidden");
  el("icon-close")?.classList.remove("hidden");
  btn?.setAttribute("aria-expanded", "true");
  btn?.setAttribute("aria-label", labels().close);
  getFocusable()[0]?.focus();
}

function closeMenu(restoreFocus = true) {
  const menu = el("mobile-menu");
  const btn = el("menu-btn");
  menu?.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
  menu?.setAttribute("inert", "");
  el("icon-open")?.classList.remove("hidden");
  el("icon-close")?.classList.add("hidden");
  btn?.setAttribute("aria-expanded", "false");
  btn?.setAttribute("aria-label", labels().open);
  if (restoreFocus) btn?.focus();
}

function isOpen() {
  return el("mobile-menu")?.classList.contains("opacity-100") ?? false;
}

// Marks the "Stack" nav links as the current location while the #stack section of the
// home page is in the middle of the viewport, like aria-current="page" on other routes.
let stackSpy: IntersectionObserver | undefined;

function initStackSpy() {
  stackSpy?.disconnect();
  stackSpy = undefined;
  const section = el("stack");
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'header a[href$="#stack"], #mobile-menu a[href$="#stack"]'
  );
  if (!section || links.length === 0) return;
  stackSpy = new IntersectionObserver(
    (entries) => {
      const active = entries[entries.length - 1]?.isIntersecting ?? false;
      links.forEach((link) => {
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  stackSpy.observe(section);
}

// Per-page wiring: start closed and bind the toggle + link handlers to the new nodes.
function initNav() {
  el("mobile-menu")?.setAttribute("inert", "");
  el("menu-btn")?.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });
  initStackSpy();
  el("mobile-menu")
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu(false)));
}

// Document-level key handler is bound once (module runs once); it re-queries the DOM.
document.addEventListener("keydown", (e) => {
  if (!isOpen()) return;
  if (e.key === "Escape") {
    closeMenu();
    return;
  }
  if (e.key === "Tab") {
    const focusable = getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

document.addEventListener("astro:page-load", initNav);
