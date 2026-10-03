# Accessibility

> Last updated: 2026-10-03

The target is WCAG AA on every page, in both themes and both languages. Visual rules (contrast values, focus style, tokens) are in [`../DESIGN.md`](../DESIGN.md#accessibility); this document says what each part of the site guarantees and how it is checked.

## Guarantees on every page

- `<html lang>` is `es` or `en` (`Layout.astro`), so assistive technology reads each language correctly.
- A skip link to `#main-content` is the first focusable element and shows on focus.
- Exactly one `h1` (`Hero` on the home page, `PageIntro` elsewhere), `h2` per section and `h3` in cards and rows. `tests/routes.spec.ts` checks the single `h1` on every route.
- Visible focus on every interactive element (`:focus-visible`, 2px `--link` outline).
- Controls without visible text have an `aria-label`; controls with visible text keep that text inside the label.
- Icon-only controls are at least 44x44 px; decorative images and icons are hidden from assistive technology (`alt=""` or `aria-hidden`); content images have descriptive `alt` text in the page language.
- Images declare `width` and `height`, which avoids layout shift.
- `prefers-reduced-motion: reduce` clamps animations and transitions and turns off smooth scroll. There is no scroll-reveal.
- Color is never the only signal: the active navigation item also gets a 2px bar, and the featured project also gets a badge.
- Theme: dark by default, switchable; the toggle has a state-aware label. Contrast is verified in both themes.

## Components with their own behavior

| Component              | Behavior                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile menu (`nav.ts`) | `aria-expanded` and `aria-controls`; the overlay is `inert` while closed; focus moves to the first link; Tab is trapped; Escape closes and returns focus |
| Navigation links       | `aria-current="page"` on the current page; `aria-current="location"` on the Stack link while `#stack` is in view                                         |
| Project filters        | Buttons with `aria-pressed`; the "no results" block is `role="status"`                                                                                   |
| Accordions             | Native `<details>` and `<summary>`                                                                                                                       |
| Quote form             | See below                                                                                                                                                |
| Navigation loader      | Decorative (`aria-hidden`), shown during page transitions                                                                                                |

### Quote form

- The form is named by its title (`aria-labelledby`), every field sits inside a `<label>`, required fields are marked in text ("Required fields") and with the `required` attribute; the red asterisk is decorative (`aria-hidden`) with a tooltip.
- Inputs use the right `type`, `autocomplete` and `inputmode` (name, email, tel, organization).
- The submit button is a real `type="submit"` that stays `disabled` until all required fields, one option and the privacy consent are set; `aria-describedby` points to the hint that says what is missing.
- Errors use `role="alert"`; the success block has `aria-live="polite"` and receives focus after sending.
- The honeypot field is `aria-hidden` and not focusable.

## How it is checked

- Lighthouse CI runs on four pages (home, projects, about, English home) and fails the build when the accessibility score is below 0.9 (`lighthouserc.json`).
- Playwright covers the skip link, the mobile menu (open, close with Escape, `aria-expanded`), `aria-pressed` filters, the quote form states and the absence of horizontal overflow on mobile.
- Manual review is still needed for heading order and contrast on case-study pages.

## Known gaps

An automated axe pass over case-study pages is pending (see [`ROADMAP.md`](./ROADMAP.md)). The Lighthouse job covers four pages, not all of them.

## Checklist for a change

- Keyboard: reach and operate everything with Tab, Enter, Space and Escape.
- One `h1`, no skipped heading levels.
- Labels, `alt` text and `aria-label` in both languages.
- Focus is visible and never trapped except in the open mobile menu.
- Check both themes and a 360 px wide viewport.
