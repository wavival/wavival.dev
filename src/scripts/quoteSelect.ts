// Quote form selects on devices with a fine pointer: the option list is drawn with the design
// of the site (WAI-ARIA select-only combobox). The native <select> stays in the form, hidden,
// and keeps the value, the validation and the submit; touch devices keep it as it is, so they
// get the picker of their own system. Every change goes through the native select and fires
// its `input` and `change` events, so the rest of the form script does not know the difference.

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const TYPEAHEAD_RESET_MS = 500;
const PAGE_STEP = 10;

let uid = 0;
let listeners: AbortController | undefined;

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

function enhance(select: HTMLSelectElement, signal: AbortSignal) {
  const field = select.closest<HTMLElement>(".quote-field");
  const caption = field?.querySelector<HTMLElement>(":scope > span");
  if (!field || !caption || select.dataset.enhanced) return;
  const id = `quote-select-${++uid}`;
  caption.id ||= `${id}-label`;
  select.dataset.enhanced = "true";
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");
  select.classList.add("quote-select-native");
  field.classList.add("quote-select");

  const combo = document.createElement("div");
  combo.id = id;
  combo.className = "quote-select-button";
  combo.tabIndex = 0;
  combo.setAttribute("role", "combobox");
  combo.setAttribute("aria-haspopup", "listbox");
  combo.setAttribute("aria-expanded", "false");
  combo.setAttribute("aria-controls", `${id}-list`);
  combo.setAttribute("aria-labelledby", caption.id);
  if (select.required) combo.setAttribute("aria-required", "true");

  const list = document.createElement("ul");
  list.id = `${id}-list`;
  list.className = "quote-select-list";
  list.setAttribute("role", "listbox");
  list.setAttribute("aria-labelledby", caption.id);
  list.tabIndex = -1;

  const options = [...select.options];
  const items = options.map((option, index) => {
    const item = document.createElement("li");
    item.id = `${id}-option-${index}`;
    item.setAttribute("role", "option");
    item.textContent = option.textContent;
    if (option.disabled) item.setAttribute("aria-disabled", "true");
    list.append(item);
    return item;
  });

  select.before(combo);
  combo.after(list);

  let active = -1;
  let typed = "";
  let typedAt = 0;
  const isOpen = () => combo.getAttribute("aria-expanded") === "true";
  const enabled = (index: number) =>
    index >= 0 && index < options.length && !options[index].disabled;

  const render = () => {
    combo.textContent = select.selectedOptions[0]?.textContent ?? "";
    combo.classList.toggle("is-placeholder", select.matches(":invalid"));
    items.forEach((item, index) =>
      item.setAttribute("aria-selected", String(index === select.selectedIndex))
    );
    if (field.dataset.touched) combo.setAttribute("aria-invalid", String(!select.checkValidity()));
  };

  const setActive = (index: number) => {
    if (!enabled(index)) return;
    items[active]?.classList.remove("is-active");
    active = index;
    items[active].classList.add("is-active");
    combo.setAttribute("aria-activedescendant", items[active].id);
    items[active].scrollIntoView({ block: "nearest" });
  };

  const step = (from: number, delta: number) => {
    let index = from;
    for (let moved = 0; moved < Math.abs(delta);) {
      const next = index + Math.sign(delta);
      if (next < 0 || next >= options.length) break;
      index = next;
      if (enabled(index)) moved++;
    }
    return enabled(index) ? index : from;
  };
  const first = () => options.findIndex((option) => !option.disabled);
  const last = () =>
    options.length - 1 - [...options].reverse().findIndex((option) => !option.disabled);

  const open = () => {
    if (isOpen()) return;
    combo.setAttribute("aria-expanded", "true");
    // Opens upward when the window has no room below and more room above, like a native list.
    const box = combo.getBoundingClientRect();
    const below = window.innerHeight - box.bottom;
    list.classList.toggle("is-above", below < list.scrollHeight && box.top > below);
    list.classList.add("is-open");
    setActive(enabled(select.selectedIndex) ? select.selectedIndex : first());
  };

  const close = () => {
    if (!isOpen()) return;
    combo.setAttribute("aria-expanded", "false");
    combo.removeAttribute("aria-activedescendant");
    list.classList.remove("is-open");
    field.dataset.touched = "true";
    render();
  };

  const choose = (index: number) => {
    if (!enabled(index)) return;
    if (index !== select.selectedIndex) {
      select.selectedIndex = index;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    render();
  };

  // Type-ahead: letters jump to the next option that starts with what was typed.
  const typeahead = (key: string) => {
    const now = Date.now();
    typed = now - typedAt > TYPEAHEAD_RESET_MS ? key : typed + key;
    typedAt = now;
    const query = normalize(typed);
    const start = typed.length === 1 ? active + 1 : Math.max(active, 0);
    for (let offset = 0; offset < options.length; offset++) {
      const index = (start + offset) % options.length;
      if (enabled(index) && normalize(options[index].textContent ?? "").startsWith(query)) {
        open();
        setActive(index);
        return;
      }
    }
  };

  combo.addEventListener(
    "keydown",
    (event) => {
      const { key, altKey } = event;
      if (key.length === 1 && key !== " " && !event.ctrlKey && !event.metaKey) {
        typeahead(key);
        event.preventDefault();
        return;
      }
      if (!isOpen()) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
          event.preventDefault();
          open();
        } else if (key === "Home" || key === "End") {
          event.preventDefault();
          open();
          setActive(key === "Home" ? first() : last());
        }
        return;
      }
      const moves: Record<string, () => number> = {
        ArrowDown: () => step(active, 1),
        ArrowUp: () => step(active, -1),
        PageDown: () => step(active, PAGE_STEP),
        PageUp: () => step(active, -PAGE_STEP),
        Home: first,
        End: last,
      };
      if (key === "ArrowUp" && altKey) {
        event.preventDefault();
        choose(active);
        close();
      } else if (moves[key]) {
        event.preventDefault();
        setActive(moves[key]());
      } else if (key === "Enter" || (key === " " && Date.now() - typedAt > TYPEAHEAD_RESET_MS)) {
        event.preventDefault();
        choose(active);
        close();
      } else if (key === " ") {
        event.preventDefault();
        typeahead(key);
      } else if (key === "Escape") {
        event.preventDefault();
        close();
      } else if (key === "Tab") {
        choose(active);
        close();
      }
    },
    { signal }
  );

  combo.addEventListener("click", () => (isOpen() ? close() : open()), { signal });
  combo.addEventListener("blur", close, { signal });
  // Keeps the focus on the combobox while the pointer picks an option.
  list.addEventListener("mousedown", (event) => event.preventDefault(), { signal });
  list.addEventListener(
    "mousemove",
    (event) => {
      const index = items.indexOf((event.target as HTMLElement).closest("li") as HTMLLIElement);
      if (index !== active) setActive(index);
    },
    { signal }
  );
  list.addEventListener(
    "click",
    (event) => {
      const index = items.indexOf((event.target as HTMLElement).closest("li") as HTMLLIElement);
      if (!enabled(index)) return;
      choose(index);
      close();
      combo.focus();
    },
    { signal }
  );
  // The field is a <label>: a click on its text focuses the combobox instead of the hidden select.
  field.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      if (!combo.contains(event.target as Node) && !list.contains(event.target as Node)) {
        combo.focus();
      }
    },
    { signal }
  );
  // Programmatic changes to the native select (autofill, tests) show up in the combobox.
  select.addEventListener("change", render, { signal });
  render();
}

function initQuoteSelects() {
  listeners?.abort();
  if (!window.matchMedia(FINE_POINTER).matches) return;
  listeners = new AbortController();
  document
    .querySelectorAll<HTMLSelectElement>("[data-quote-form] .quote-field select")
    .forEach((select) => enhance(select, listeners!.signal));
}

document.addEventListener("astro:page-load", initQuoteSelects);

export {};
