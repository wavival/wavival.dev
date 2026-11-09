// Loads the Calendly inline widget only after the visitor asks for it (see CalendlyEmbed.astro).
// The widget colors come from the design tokens of the current theme.

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

let listeners: AbortController | undefined;

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace(/^#/, "");

function load(root: HTMLElement) {
  const params = new URLSearchParams({
    hide_gdpr_banner: "1",
    primary_color: token("--btn"),
    background_color: token("--bg"),
    text_color: token("--text"),
  });
  const widget = document.createElement("div");
  widget.className = "calendly-inline-widget";
  widget.dataset.url = `${root.dataset.url}?${params}`;
  root.querySelector("[data-calendly-placeholder]")?.remove();
  root.append(widget);
  root.focus({ preventScroll: true });

  // Calendly reports its content height; the frame follows it and gets an accessible title.
  window.addEventListener(
    "message",
    (event) => {
      if (!/^https:\/\/([a-z0-9-]+\.)*calendly\.com$/.test(event.origin)) return;
      if (event.data?.event !== "calendly.page_height") return;
      const frame = widget.querySelector("iframe");
      if (frame) frame.title = root.dataset.frameTitle ?? frame.title;
      // While it loads Calendly reports a few pixels; the reserved height is the floor, so the
      // block only grows when the calendar really needs more room.
      const height = parseFloat(event.data.payload?.height ?? "");
      const reserved = parseFloat(token("--calendar-embed-h"));
      if (!(height > reserved)) return;
      widget.style.height = `${height}px`;
      if (frame) frame.style.height = `${height}px`;
    },
    { signal: listeners?.signal }
  );

  const script = document.createElement("script");
  script.src = WIDGET_SRC;
  script.async = true;
  document.body.append(script);
}

function initCalendly() {
  listeners?.abort();
  const root = document.querySelector<HTMLElement>("[data-calendly]");
  const button = document.getElementById("calendly-load");
  if (!root || !button) return;
  listeners = new AbortController();
  button.addEventListener("click", () => load(root), { once: true, signal: listeners.signal });
}

document.addEventListener("astro:page-load", initCalendly);

export {};
