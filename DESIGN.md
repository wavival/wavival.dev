# DESIGN.md: Design System

Design tokens, typography, composition rules, and component classes for `wavival.dev`. Everything documented here lives in `src/styles/` and `tailwind.config.mjs`. The system is called "@wavival | Design System v4" and was designed in the Claude Design project `wavival-dev-v4` (files `wavival-dev-v4.dc.html`, `wavival-dev-v4-design-system.dc.html`, `wavival-dev-v4-design.md`).

Related: [README.md](./README.md) · [COMPONENTS.md](./COMPONENTS.md) · [CLAUDE.md](./CLAUDE.md)

## Table of contents

- [Principles](#principles)
- [Tokens](#tokens)
  - [Colors](#colors)
  - [Structure](#structure)
  - [Type scale](#type-scale)
  - [Tailwind aliases](#tailwind-aliases)
- [Typography](#typography)
- [Composition rules](#composition-rules)
- [Component classes](#component-classes)
- [Component catalog](#component-catalog)
- [Page inventory](#page-inventory)
- [Dark mode strategy](#dark-mode-strategy)
- [Motion](#motion)
- [Accessibility](#accessibility)

## Principles

Concept: the page reads like an editorial index, with one blue signal on a quiet field.

- **Rules, not boxes.** Structure comes from 1px lines (`--line`, `--line-2`, and `--text` for section rules), never from shadow cards. There are no shadows and surfaces have `0` radius.
- **Editorial scale.** Raleway 800 display type at large sizes, tight tracking, numbered indexes (`01`, `02`) as wayfinding.
- **One blue signal.** `--blue` marks bars and fills and `--blue-text` the small index numbers; `--link` is the single interactive blue for text, links, icons, and focus; `--btn` fills the primary button.
- **Icons only where they work.** Icons appear on icon-only buttons and on the primary button. Text buttons and text links carry no icons or arrows.
- **One column narrative.** Content runs at the full container width (`--container: 1280px`) in a single column, vertically centered in its band.
- **State as text.** The accordion shows "Ver"/"Cerrar" (ES) or "View"/"Close" (EN) instead of a rotating chevron.
- **Tokens over hardcoded values.** Every color and size lives in `src/styles/tokens.css` as a CSS custom property. Components use `var(--token)` or the Tailwind alias that maps to it.
- **`.dark` class, not media query.** Dark is the default theme and is toggled by the user. `tailwind.config.mjs` sets `darkMode: 'class'`.
- **Static.** No scroll reveal and no JS animation; the only client behavior is the theme toggle, the mobile menu, the project filters, and optional analytics.

## Tokens

All tokens live in `src/styles/tokens.css`. Defined on `:root` (light) and overridden on `.dark`. Tokens not listed under `.dark` are theme-independent.

### Colors

| Token         | Light                    | Dark                    | Usage                                                                                |
| ------------- | ------------------------ | ----------------------- | ------------------------------------------------------------------------------------ |
| `--bg`        | `#f0f4ff`                | `#0f1117`               | Page background                                                                      |
| `--surface`   | `#ffffff`                | `#1a1f2e`               | Cards, bands (`ContactBand`), frames                                                 |
| `--line`      | `#e2e8f0`                | `#2d3748`               | Default 1px rules and borders                                                        |
| `--line-2`    | `#cbd5e1`                | `#4a5568`               | Stronger borders (secondary button)                                                  |
| `--tint`      | `rgba(64,123,255,0.06)`  | `rgba(64,123,255,0.08)` | Subtle blue wash                                                                     |
| `--text`      | `#1a1a2e`                | `#e8eaf6`               | Headings, primary copy, section rules                                                |
| `--muted`     | `#4b5563`                | `#9ca3af`               | Secondary copy (about 5.9:1 light, 7.4:1 dark on `--bg`)                             |
| `--link`      | `#1565c0`                | `#5b8cff`               | Links, icons (mask tint), focus outline, small blue text (5.13:1 light, 5.93:1 dark) |
| `--link-h`    | `#0f4c91`                | `#82a8ff`               | Link hover                                                                           |
| `--blue`      | `#407bff`                | (same)                  | Fills, borders, bars, selection, scrollbar, large/display text only (fails AA small) |
| `--blue-text` | `#1565c0`                | `#407bff`               | Small blue text such as `.index` numbers (>=4.5:1 on `--bg` in both themes)          |
| `--btn`       | `#1565c0`                | (same)                  | `.btn-primary` and `.badge` fill                                                     |
| `--btn-h`     | `#0f4c91`                | (same)                  | `.btn-primary` hover fill                                                            |
| `--on-btn`    | `#ffffff`                | (same)                  | Text on `--btn` (5.67:1)                                                             |
| `--nav`       | `rgba(240,244,255,0.85)` | `rgba(15,17,23,0.85)`   | Sticky header fill (with backdrop blur)                                              |
| `--ok`        | `#15803d`                | `#4ade80`               | Success/available status dot                                                         |
| `--warn`      | `#c2410c`                | `#fb923c`               | Warning status dot                                                                   |
| `--danger`    | `#b91c1c`                | `#fca5a5`               | Error text and the required-field asterisk                                           |

The button fill is theme-independent so white text stays at or above 4.5:1 in both themes (the retired dodger-blue accent was only 3.24:1).

### Structure

| Token              | Value                      | Usage                                          |
| ------------------ | -------------------------- | ---------------------------------------------- |
| `--container`      | `1280px`                   | Max content width (`.wrap`, `max-w-container`) |
| `--gut`            | `clamp(20px, 4vw, 48px)`   | Horizontal page gutter                         |
| `--sec`            | `clamp(80px, 10vw, 144px)` | Vertical gap between sections                  |
| `--sec-compact`    | `clamp(56px, 7vw, 96px)`   | Tighter section gap                            |
| `--nav-h`          | `64px`                     | Sticky header height                           |
| `--radius-surface` | `0`                        | Cards, frames, bands                           |
| `--radius-control` | `2px`                      | Buttons, chips, icon buttons                   |
| `--radius-dot`     | `50%`                      | Status dots                                    |
| `--font-display`   | `"Raleway", sans-serif`    | Headings, buttons, labels                      |
| `--font-body`      | `"Poppins", sans-serif`    | Body copy                                      |

### Type scale

| Token                  | Value                       | Used by                                             |
| ---------------------- | --------------------------- | --------------------------------------------------- |
| `--fs-display-xl`      | `clamp(36px, 5.2vw, 80px)`  | `.display-xl` (home `h1`)                           |
| `--fs-display-page`    | `clamp(44px, 7vw, 108px)`   | `.display-page` (page `h1`)                         |
| `--fs-display-index`   | `clamp(48px, 8vw, 120px)`   | `.display-index` (`/proyectos` `h1`)                |
| `--fs-display-contact` | `clamp(44px, 7.4vw, 116px)` | `.display-contact` (`/contacto` `h1`)               |
| `--fs-display-case`    | `clamp(52px, 9vw, 148px)`   | `.display-case` (case study `h1`, lh .92)           |
| `--fs-display-uses`    | `clamp(52px, 9vw, 140px)`   | `.display-uses` (`/herramientas` `h1`, lh .92)      |
| `--fs-display-about`   | `clamp(56px, 10vw, 160px)`  | `.display-about` (`/sobre-mi` `h1`, lh .9, -0.05em) |
| `--fs-display-cta`     | `clamp(40px, 6.4vw, 100px)` | `.display-cta` (`ContactBand` `h2`)                 |
| `--fs-h2-sub`          | `clamp(32px, 4vw, 56px)`    | `.h2-sub` (sub-section `h2`)                        |
| `--fs-body-md`         | `16px`                      | `.body-md` (legal copy, "Qué construyo")            |
| `--fs-h2`              | `clamp(36px, 5vw, 72px)`    | `.h2-section`                                       |
| `--fs-h2-case`         | `clamp(30px, 3.4vw, 48px)`  | `CaseSection` heading                               |
| `--fs-h3-project`      | `clamp(40px, 6vw, 88px)`    | `.h3-project`                                       |
| `--fs-lead`            | `clamp(22px, 2.2vw, 30px)`  | `.lead`                                             |
| `--fs-body-lg`         | `18px`                      | `.body-lg`                                          |
| `--fs-body`            | `16px`                      | Body base                                           |
| `--fs-body-sm`         | `15px`                      | `.body`                                             |
| `--fs-label`           | `12px`                      | `.eyebrow`                                          |
| `--fs-label-sm`        | `11px`                      | `.label-sm`, `.badge`                               |
| `--tracking-display`   | `-0.04em`                   | Display and project titles                          |
| `--tracking-h2`        | `-0.035em`                  | `.h2-section`                                       |
| `--tracking-label`     | `0.16em`                    | Uppercase labels                                    |
| `--tracking-button`    | `0.1em`                     | `.btn`                                              |

### Tailwind aliases

`tailwind.config.mjs` maps tokens so utilities stay token-driven:

| Group     | Aliases                                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| Colors    | `bg`, `surface`, `line`, `line-2`, `tint`, `ink` (= `--text`), `muted`, `link`, `link-h`, `blue`, `btn`, `btn-h`, `ok` |
| Max width | `max-w-container`                                                                                                      |
| Radius    | `rounded-control`                                                                                                      |
| Spacing   | `gut`, `sec`, `nav` (for example `h-nav`, `top-nav`, `px-gut`)                                                         |

The pre-v4 tokens (`--brand-blue`, `--brand-blue-text`, `--bg-page`, `--bg-card`, `--bg-blur`, `--nav-blur`, `--text-primary`, `--text-muted`, `--accent-link`, `--accent-hover`, `--btn-bg`, `--border-base`, `--shadow-base`, `--radius-sm/md/lg`, `--space-section`) were removed.

## Typography

Configured in `tailwind.config.mjs` and `tokens.css`:

| Family  | Tailwind class | Stack                 | Role                                                         |
| ------- | -------------- | --------------------- | ------------------------------------------------------------ |
| Display | `font-display` | `Raleway, sans-serif` | Display and titles (800), buttons, uppercase labels, indexes |
| Body    | `font-body`    | `Poppins, sans-serif` | Body copy                                                    |

Self-hosted: latin-subset `woff2` in `public/fonts/`, declared via `@font-face` (`font-display: swap`) in `global.css`. Poppins ships as static weights (400, 500, 600); Raleway is a single variable `woff2` (`wght` 600-800, one `@font-face` with `font-weight: 600 800`). Critical weights (Poppins 400 + Raleway variable) are preloaded in `Layout.astro`. No Google Fonts request or `preconnect`.

## Composition rules

- Pages sit inside `.wrap` (container + gutters). Vertical rhythm comes from `.page-top`, `.section-gap`, and `--sec` / `--sec-compact`.
- Each section opens with a `.rule-section` (1px top rule in `--text`), an optional `.index` number, an `.eyebrow` label, and a display heading (`SectionHeader`).
- Lists and grids are drawn with `border-top` / `.cell-grid` lines, not card shadows. Card grids use `Bento` so rows fill the 12 columns with irregular spans and no card is left alone in a corner.
- Media sit in a `.media-frame` (1200x630, 1px border) or `.photo-frame` (4:5 portrait with a 4px blue bar).
- One `h1` per page: `Hero` on home, `PageIntro` elsewhere. Sections use `h2`, cards and rows use `h3`.
- The header is sticky (64px, `--nav` fill with backdrop blur), not fixed, so `<main>` has no top padding. The active link shows text color plus a 2px blue bar.
- Below 900px the menu is a full-screen overlay with numbered display links, a "Blog W" primary button and a mailto secondary button.
- The language toggle is the text "EN" / "ES"; icon-only controls are 44px (`.icon-btn`, `.lang-toggle`).
- `ContactBand` closes the home and also services, about, and case studies.
- Accordions are native `<details>` (`Disclosure`) with the state shown as text and a short open/close transition.
- Line-height defaults to 1.6 (body and the Tailwind `fontSize` scale); display headings, chips (1.2) and meta labels (1) set it explicitly.
- The mobile menu overlay is a sibling of the sticky `<header>`, never a child: `backdrop-filter` on the header would otherwise become the containing block of the `fixed` overlay.

## Component classes

All inside `@layer components` in `src/styles/utilities.css`, 2-space indentation.

| Class                                                | Purpose                                                                                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.wrap`                                              | Container: full width, `max-width: var(--container)`, `padding-inline: var(--gut)`                                                                                    |
| `.page-top`                                          | Top padding for standalone pages, `--sec` bottom                                                                                                                      |
| `.section-gap`                                       | `margin-top: var(--sec)`                                                                                                                                              |
| `.rule-section`                                      | Section opener: 24px top padding, 1px top border in `--text`                                                                                                          |
| `.rule-line`                                         | 1px top border in `--line`                                                                                                                                            |
| `.eyebrow`                                           | Uppercase Raleway 700 label in `--link` (`--fs-label`)                                                                                                                |
| `.label-sm` (+ `.label-sm-link`)                     | Smaller uppercase label in `--muted` (or `--link`)                                                                                                                    |
| `.index`                                             | Raleway 800 number in `--blue-text`                                                                                                                                   |
| `.display-xl`, `.display-page`                       | Display headings (home / page `h1`)                                                                                                                                   |
| `.h2-section`, `.h3-project`, `.h-title`             | Section heading, project title, generic Raleway 800 title                                                                                                             |
| `.lead`, `.body-lg`, `.body`                         | Lead paragraph, large body, small body (muted)                                                                                                                        |
| `.accent`                                            | `--blue` text for display emphasis                                                                                                                                    |
| `.btn`                                               | Base button: Raleway 700, uppercase, `--radius-control`; `.btn-primary` (fill `--btn`), `.btn-secondary` (`--line-2` outline), sizes `.btn-sm`, `.btn-compact` (44px) |
| `.action-link`, `.list-link`, `.inline-link`         | Underlined uppercase link, list link (`aria-current` to `--link`), in-prose link                                                                                      |
| `.icon-btn` (+ `.icon-btn-lg`)                       | 44px (50px) bordered icon button                                                                                                                                      |
| `.mask-icon` (+ `-lg`, `-xl`)                        | Icon tinted with `--link` through CSS mask (`--icon` custom property)                                                                                                 |
| `.lang-toggle`                                       | 44px text toggle "EN"/"ES"                                                                                                                                            |
| `.chip`                                              | Bordered tag, 2px radius                                                                                                                                              |
| `.status`, `.status-dot` (+ `-ok`, `-link`, `-warn`) | Status label with a 7px dot                                                                                                                                           |
| `.badge`                                             | Solid `--btn` label                                                                                                                                                   |
| `.cell-grid`                                         | Grid drawn with 1px borders                                                                                                                                           |
| `.bento-wrap`, `.bento`                              | Irregular grid sized by its container: 1 column, 2 from 480px, 12 from 760px; children take `--span` from `src/utils/bento.ts`                                        |
| `.nav-link`                                          | Header link; `aria-current="page"` gets text color and a 2px `--blue` bar                                                                                             |
| `.media-frame`, `.photo-frame`                       | 1200x630 image frame; 4:5 portrait frame with a 4px blue bottom bar                                                                                                   |
| `.disclosure`                                        | Native `<details>` styling: hides the marker, swaps `.when-closed` / `.when-open` text                                                                                |

Removed with v4: `.section`, `.section-title`, `.section-subtitle`, `.btn-ghost`, `.card`, `.card-plain`, `.link`, `.icon`, `.icon-sm/md/lg/xl`, `.profile-photo`.

## Component catalog

Atomic structure under `src/components/` (props in [COMPONENTS.md](./COMPONENTS.md)):

- **Atoms:** `Button`, `TextLink`, `IconLink`, `MaskIcon`, `Chip`, `StatusDot`, `Badge`, `Eyebrow`, `Index`
- **Molecules:** `SectionHeader`, `PageIntro`, `ChipList`, `ProjectMeta`, `ProjectActions`, `Metric`, `DefRow`, `SocialLinks`, `ThemeToggle`, `Disclosure`, `PullQuote`, `Bento`
- **Organisms:** `NavBar`, `Footer`, `ContactBand`, `Hero`, `FeaturedProjects`, `StackSection`, `StackGrid`, `AboutSection`, `ProjectRow`, `ProjectCard`, `ProjectsIndex`, `ProjectFilters`, `RepoCard`, `ServiceRow`, `ServicesDetail`, `LegalSection`, `NotFound`, `CaseStudy`, `CaseToc`, `CaseSection`
- **Template:** `src/layouts/Layout.astro`

## Page inventory

| Page (ES / EN)                             | Composition                                                                                                                                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` and `/en`                              | `Hero` (#hero), `FeaturedProjects` (#projects), `StackSection` (#stack), `AboutSection` (#about), `ContactBand` (#contact)                                                                                        |
| `/proyectos` and `/en/projects`            | `PageIntro`, `ProjectsIndex` (`ProjectFilters` + `ProjectCard`s)                                                                                                                                                  |
| `/proyectos/[slug]`, `/en/projects/[slug]` | `CaseStudy`: sections `cs-problem`, `cs-architecture`, `cs-design`, `cs-decisions`, `cs-results`, `cs-learnings`, `cs-roadmap` (design and roadmap render only when the project sets them), closing `ContactBand` |
| `/servicios` and `/en/services`            | `PageIntro`, `ServiceRow`s, `ServicesDetail`, `ContactBand`                                                                                                                                                       |
| `/cotizar` and `/en/quote`                 | `PageIntro`, two-column field grid, service checklist, and in-place confirmation                                                                                                                                  |
| `/sobre-mi` and `/en/about`                | `PageIntro`, `SectionHeader`s, `PullQuote`, `ContactBand`                                                                                                                                                         |
| `/contacto` and `/en/contact`              | `PageIntro`, contact channels with `SectionHeader`                                                                                                                                                                |
| `/herramientas` and `/en/uses`             | `PageIntro`, stack breakdown with `ChipList`, `RepoCard`s in `#repos`                                                                                                                                             |
| `/privacidad` and `/en/privacy`            | `PageIntro`, `LegalSection`s                                                                                                                                                                                      |
| `/404` and `/en/404`                       | `NotFound` (noindex)                                                                                                                                                                                              |

## Dark mode strategy

- `tailwind.config.mjs` sets `darkMode: 'class'`.
- **Dark is the default.** A synchronous `<script is:inline>` at the top of `<head>` (in `Layout.astro`) adds `.dark` to `<html>` before stylesheets load unless `localStorage["theme"] === "light"`. It no longer follows `prefers-color-scheme`. The `theme-color` meta defaults to `#0f1117`. This eliminates FOUC.
- **Post-paint behavior** is owned by `src/scripts/theme.ts`: it syncs the sun/moon `MaskIcon`s and the state-aware `aria-label` to the already-applied state, then handles toggle clicks. Each click flips `.dark` on `<html>`, writes `localStorage["theme"]`, and re-syncs icons and the meta.
- The dark overrides in `tokens.css` are `--bg`, `--surface`, `--line`, `--line-2`, `--tint`, `--text`, `--muted`, `--link`, `--link-h`, `--nav`, `--ok`, `--warn`.
- Never use `@media (prefers-color-scheme)` in CSS; the `.dark` class is the single source of truth.

## Motion

The design is static. There is no scroll reveal (`[data-aos]` and `.aos-in` were removed). Navigation and disclosures use only short functional motion.

| Source                   | Behavior                                                                                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global.css`             | `body` transitions `background-color` and `color` (0.3s); `html` uses smooth scroll with `scroll-padding-top: 88px`; View Transitions fade between routes and the persistent W-logo loader appears immediately during navigation for at least one second |
| Component classes        | Short color/border-color transitions (0.2s to 0.25s) on buttons, links, icon buttons, frames                                                                                                                                                             |
| Mobile menu              | Opacity/translate transition (300ms) on the overlay                                                                                                                                                                                                      |
| `Disclosure`             | Native `<details>` content expands in 220ms and closes in 180ms through the Web Animations API                                                                                                                                                           |
| `prefers-reduced-motion` | All animations/transitions clamped to `0.01ms` and smooth scroll disabled                                                                                                                                                                                |

The reduce-motion override lives in `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Accessibility

- Visible focus on every interactive element through the global `:focus-visible { outline: 2px solid var(--link); outline-offset: 2px }` in `global.css`.
- All controls without visible text have an `aria-label`; controls with visible text keep that text inside the `aria-label` (Label-in-Name).
- Skip link to `#main-content` (`Layout.astro`), visible only on focus.
- Heading hierarchy: single `h1` (`Hero` on home, `PageIntro` elsewhere), `h2` per section, `h3` in cards and rows.
- Decorative `<img>` and `MaskIcon`s are hidden from assistive tech (`alt=""` / `aria-hidden`). Content images have descriptive `alt`.
- Icon-only controls (`.icon-btn`, `.lang-toggle`, `IconLink`) are at least 44x44 px.
- Mobile menu (`src/scripts/nav.ts`): `aria-expanded` + `aria-controls`; the overlay is `inert` while closed, focus moves to the first link on open, Tab is trapped, Escape closes and restores focus to the hamburger. The hamburger `aria-label` is localized and state-aware.
- `aria-current="page"` on the active NavBar and Footer link (via `ariaCurrent()`), shown beyond color: a 2px blue bar in the header.
- Project filters expose state with `aria-pressed`; the "no results" block is `role="status"`.
- The accordion is native `<details>`/`<summary>`, so keyboard and screen-reader behavior come from the browser.
- WCAG AA contrast verified in both themes: `--muted` on `--bg` (about 5.9:1 light / 7.4:1 dark), white `--on-btn` on `--btn` (5.67:1), `--link` on `--bg` (5.13:1 light / 5.93:1 dark). `--blue` is limited to fills, borders, indexes, and large text.
