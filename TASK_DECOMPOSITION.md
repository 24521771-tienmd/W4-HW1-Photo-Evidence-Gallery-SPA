# Task Decomposition (WBS)

One line per planned commit. Tick the box in the same commit as the work. The hash is the commit that delivered the item (the docs item is delivered by the commit that adds this line, so it has no hash inside itself; see `git log`).

## Sprint 0 - Setup
- [x] `chore: scaffold Vite React 19 app with React Router v7 and Vitest` - d923663
- [x] `docs: add project rules, task decomposition, AI audit template and env example` - f9e7686

## Sprint 1 - Routing and data
- [x] Router layout: `BrowserRouter`, `Routes`, nested layout with `Outlet`, `NavLink` navigation, lazy routes with skeleton fallbacks - tests 4e2252a, implementation 888a762
- [x] Photo assets: `npm run photos` script generating optimized local WebP evidence images (400 + 1200) - bdd5cfa
- [x] Photo data: catalog module (ids, categories, alt text, dimensions) + query helpers - ccb7647

## Sprint 2 - Gallery features
- [x] Category filter via `useSearchParams` (`?category=devices`) - tests 034dcf4, implementation c1185f3
- [x] Dialog lightbox: native `<dialog>`, `?photoId=` deep link, open/close sync with URL - tests af31ad5, implementation 78d9ea1
- [x] Lightbox keyboard and focus: Esc, arrow navigation, focus trap/return, focus restore on close - 0830256

## Sprint 3 - Quality
- [x] Accessibility pass: WCAG 2.2 AA audit, contrast, target size, reduced motion, landmarks - 6357870
- [x] Performance pass: code splitting, image sizing/lazy loading, CLS = 0, Lighthouse (desktop 100/100/100/100; mobile Performance 98-99) - 92bf3ae

## Sprint 4 - Docs
- [x] Docs: README update, Lighthouse results, AI failure audit entries (real ones only) - this commit (`docs: finalize README, task decomposition and AI failure audit`)
