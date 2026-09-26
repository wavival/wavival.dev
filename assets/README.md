# assets/

README-only assets. Referenced from the root `README.md`. **Not shipped to production** (Astro only publishes `public/`).

| File         | Used as                                                  | Replace with                                    |
| ------------ | -------------------------------------------------------- | ----------------------------------------------- |
| `logo-w.png` | Inline logo next to the H1 title and the contact heading | Brand logo (≈ 96×96 PNG/WebP with transparency) |
| `banner.png` | Banner under the H1 (`![Banner principal]`)              | Wide marketing banner (≈ 1280×400 PNG/WebP)     |
| `footer.png` | Banner above the contact section                         | Wide footer banner (≈ 1280×400 PNG/WebP)        |

These files are README-only and are not shipped to production. The project banners are already
converted to optimized WebP OG cards in `public/images/` and do not need duplicate PNG sources in
this directory.
