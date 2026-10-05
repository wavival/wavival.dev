# Accessibility

> Last updated: 2026-10-05

The target is WCAG AA on every page, in both themes and both languages. Visual rules (contrast values, focus style, tokens) are in [`../DESIGN.md`](../DESIGN.md#accessibility); this document says what each part of the site guarantees and how it is checked.

## Guarantees on every page

- `<html lang>` is `es` or `en` (`Layout.astro`), so assistive technology reads each language correctly.
- A skip link to `#main-content` is the first focusable element and shows on focus.
- Exactly one `h1` (`Hero` on the home page, `CaseStudy` on case studies, `NotFound` on the 404 pages, `PageIntro` elsewhere), `h2` per section and `h3` in cards and rows. On an ecosystem project page each part title is an `h2` and the sections inside a part are `h3`. `tests/routes.spec.ts` checks the single `h1` on every route.
- Visible focus on every interactive element (`:focus-visible`, 2px `--link` outline).
- Controls without visible text have an `aria-label`; controls with visible text keep that text inside the label. `Button`, `TextLink` and the language toggle enforce it with `labelInName` (`src/utils/a11y.ts`), and `tests/label-in-name.spec.ts` checks every page of the sitemap.
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
| Accordions             | Native `<details>` and `<summary>` (`Disclosure`, `PartDisclosure`); see below                                                                           |
| Quote form             | See below                                                                                                                                                |
| Navigation loader      | Decorative (`aria-hidden`), shown during page transitions                                                                                                |
| Calendly embed         | Contact page only: a `role="region"` with an `aria-label`, and a `<noscript>` fallback with a link to Calendly and the email address                     |

### Accordions and ecosystem parts

- Each part of a project (rich or link-only) is a `<details id="app">` (or `landing`, `blog`...) with a heading (`h2`) inside its `<summary>`, so the part should show in the heading outline (checked in Chromium's accessibility tree only; see [`ROADMAP.md`](./ROADMAP.md)) and the browser provides the expanded state and the Enter and Space toggle. Link-only parts are plain rows with the same `h2`, not accordions.
- The visible open and close text ("Ver detalle" / "Ocultar", "View details" / "Hide") is part of the summary, so the accessible name already contains it (label in name).
- A URL hash, a hash change or a click on a contents link opens the part it targets (`src/scripts/part-disclosure.ts`), so a deep link never lands on a closed panel (a target nested inside a closed part opens it and scrolls to the target; a malformed hash does not throw); the first part starts open.
- The open and close animation lives in the shared script `src/scripts/disclosure.ts` and is skipped under `prefers-reduced-motion: reduce`; the scroll to a part uses `auto` behavior in that case. Without scripts the accordions still toggle.
- Project links are stacked in one column on the page header and in each accordion (`ProjectActions` with `stacked`), in the same `TextLink` style as the rest of the site; cards on the index and home show only the case-study link.
- `tests/ecosystem.spec.ts` covers the keyboard toggle, the hash opening (malformed and nested hashes included), the header link column and the absence of external links on cards.

### Quote form

- The form is named by its title (`aria-labelledby`), every field sits inside a `<label>`, required fields are marked in text ("Required fields") and with the `required` attribute; the red asterisk is decorative (`aria-hidden`) with a tooltip.
- Inputs use the right `type`, `autocomplete` and `inputmode` (name, email, tel, organization).
- The case-study button opens the form with `?mode=types`: the project types are shown with none selected, so the visitor chooses one before the submit button enables.
- The submit button is a real `type="submit"` that stays `disabled` until all required fields, one option and the privacy consent are set; `aria-describedby` points to the hint that says what is missing.
- Errors use `role="alert"`; the success block has `aria-live="polite"` and receives focus after sending.
- The honeypot field is `aria-hidden` and not focusable.

## How it is checked

- Lighthouse CI runs on four pages (home, projects, about, English home) and fails the build when the accessibility score is below 0.9 (`lighthouserc.json`).
- Playwright covers the skip link, the project accordions and hash opening, the mobile menu (open, close with Escape, `aria-expanded`), `aria-pressed` filters, the quote form states and the absence of horizontal overflow on mobile.
- Manual review is still needed for heading order and contrast on case-study pages.

## Known gaps

An automated axe pass over case-study pages is pending (see [`ROADMAP.md`](./ROADMAP.md)). The Lighthouse job covers four pages, not all of them.

## Checklist for a change

- Keyboard: reach and operate everything with Tab, Enter, Space and Escape.
- One `h1`, no skipped heading levels.
- Labels, `alt` text and `aria-label` in both languages; a visible label always stays inside the `aria-label` (checked by `tests/label-in-name.spec.ts`).
- Focus is visible and never trapped except in the open mobile menu.
- Check both themes and a 360 px wide viewport.
