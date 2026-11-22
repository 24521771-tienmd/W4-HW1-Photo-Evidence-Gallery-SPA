# Task Decomposition (WBS)

One line per planned commit. Tick the box in the same commit as the work.

## Sprint 0 - Setup
- [x] `chore: scaffold Vite React 19 app with React Router v7 and Vitest`
- [x] `docs: add project rules, task decomposition, AI audit template and env example`

## Sprint 1 - Routing and data
- [x] Router layout: `BrowserRouter`, `Routes`, nested layout with `Outlet`, `NavLink` navigation, lazy routes with skeleton fallbacks
- [x] Photo assets: `npm run photos` script generating optimized local WebP evidence images (400 + 1200)
- [x] Photo data: catalog module (ids, categories, alt text, dimensions) + query helpers

## Sprint 2 - Gallery features
- [x] Category filter via `useSearchParams` (`?category=devices`)
- [x] Dialog lightbox: native `<dialog>`, `?photoId=` deep link, open/close sync with URL
- [x] Lightbox keyboard and focus: Esc, arrow navigation, focus trap/return, focus restore on close

## Sprint 3 - Quality
- [x] Accessibility pass: WCAG 2.2 AA audit, contrast, target size, reduced motion, landmarks
- [x] Performance pass: code splitting, image sizing/lazy loading, CLS = 0, Lighthouse 100/100/100/100

## Sprint 4 - Docs
- [ ] Docs: README update, Lighthouse results, AI failure audit entries (real ones only)
