# Photo & Evidence Gallery

Production multi-route photo and evidence gallery SPA (UIT Lab 4, Web Application Development, Homework 1).

## Features

- Multi-route SPA with React Router v7 (declarative mode) and a shared root layout (skip link, primary nav, footer).
- 24 locally generated, abstract "evidence" photos in 4 categories (documents, devices, locations, exhibits), served as optimized WebP in two sizes.
- Category filter stored in the URL, so every filtered view is shareable.
- Lightbox built on the native `<dialog>` element (`showModal()` / `close()`), also driven by the URL.
- Keyboard support in the lightbox: Esc closes, ArrowLeft/ArrowRight browse the current filtered list (wrapping), focus returns to the photo's grid button on close.
- Route-level code splitting (`React.lazy` + `<Suspense>`) with dimension-matched skeletons (`aria-busy="true"`, `aria-live="polite"`).
- WCAG 2.2 AA oriented: axe tests, contrast tests, visible focus, 44px targets, reduced-motion support.
- Native CSS only (Grid + `@media`), system font stack, no UI library.

## Route map

| Path | Page | Loading |
| --- | --- | --- |
| `/` | Home | eager |
| `/gallery` | Gallery (filter, grid, lightbox) | lazy chunk + skeleton |
| `/about` | About (archive concept, accessibility statement) | lazy chunk + skeleton |
| `*` | Not found | lazy chunk + skeleton |

All routes are children of `RootLayout`, which renders `<Outlet />` inside `<main id="main">`.

## URL contract

The Gallery page reads two search params:

| Param | Meaning | Values |
| --- | --- | --- |
| `category` | Active filter | `documents`, `devices`, `locations`, `exhibits`. Missing or unknown = all photos ("All" is pressed). |
| `photoId` | Photo open in the lightbox | A photo id such as `dev-03`. Unknown id = dialog stays closed and a status message offers to clear it. |

Rules:

- Choosing a category changes only `category`; other params (such as `photoId`) are preserved. "All" removes `category`.
- Opening a photo adds `photoId` and pushes a history entry, so the browser Back button closes the lightbox.
- Closing the lightbox (Esc, close button, backdrop click) removes only `photoId` and keeps `category`.
- Arrow-key / Previous / Next browsing replaces `photoId` in place, so it does not flood history.

Example deep links:

- `/gallery` - all photos
- `/gallery?category=devices` - only devices
- `/gallery?category=devices&photoId=dev-03` - devices list with photo `dev-03` open
- `/gallery?photoId=exh-05` - all photos with `exh-05` open

## Scripts

```bash
npm install
npm run dev         # dev server
npm run build       # production build to dist/
npm run preview     # serve the production build at http://localhost:4173
npm test            # run tests once (Vitest + Testing Library + axe)
npm run test:watch  # tests in watch mode
npm run lint        # ESLint (flat config, react-hooks rules)
npm run photos      # regenerate public/photos/*.webp (idempotent)
npm run lh          # Lighthouse (desktop) on /gallery -> lighthouse-report.html (git-ignored)
```

## Reproducing the Lighthouse score

Lighthouse must run against the production build, not the dev server. Chrome (or Chromium) must be installed.

```bash
npm run build
npm run preview        # leave running, serves http://localhost:4173
# in a second terminal:
npm run lh                                                    # desktop preset, HTML report
npx lighthouse http://localhost:4173/gallery --view           # mobile (default preset)
```

Results measured on `/gallery` with the production preview (Chrome headless, 2026-11-22):

| Preset | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 98-99 | 100 | 100 | 100 |

CLS is 0 on both. Mobile Performance is below 100 because LCP is about 2.1 s: the page must run the React + Router entry bundle (about 84 kB gzip) before the lazy Gallery chunk can render the first image. Scores vary slightly between runs.

## Architecture notes

**The URL is the single source of truth.** The active category and the open photo are not copied into `useState`. Components read `useSearchParams()` and derive everything during render (`getPhotosByCategory`, `getPhotoById`, `getNeighbors`). That makes deep links, reload, Back/Forward and sharing work with no synchronization code, and removes a whole class of "state and URL disagree" bugs. Updates use the functional form `setSearchParams(prev => ...)` so unrelated params are never wiped.

**The only `useEffect` is the dialog sync.** `Lightbox` has one effect that calls `dialog.showModal()` / `dialog.close()` so the native `<dialog>` matches the URL-derived photo (guarded by `dialog.open`), and restores focus afterwards. The dialog is an external system, so an effect is the right tool. Filtered lists, the selected photo, neighbors, counts and the "not found" state are all derived values and deliberately do not use effects.

### Project layout

```
src/
  App.jsx               routes, lazy loading, Suspense fallbacks
  layouts/RootLayout.jsx  skip link, header/nav, main, footer
  pages/                Home, Gallery, About, NotFound
  components/           CategoryFilter, PhotoGrid, Lightbox, PageSkeleton
  data/                 photos.js (catalog), photoQueries.js (pure helpers)
  __tests__/            routing, filter, lightbox, a11y, contrast, query tests
scripts/generate-photos.mjs   procedural SVG -> WebP generator (sharp)
public/photos/                generated images (committed)
```

## Project documents

- [project-rules.md](project-rules.md) - coding standards and workflow
- [TASK_DECOMPOSITION.md](TASK_DECOMPOSITION.md) - work breakdown with commit hashes
- [AI_FAILURE_AUDIT.md](AI_FAILURE_AUDIT.md) - log of AI mistakes and how they were caught
