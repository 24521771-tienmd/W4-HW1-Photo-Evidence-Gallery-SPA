# Photo & Evidence Gallery

Production multi-route photo and evidence gallery SPA (UIT Lab 4, Web Application Development, Homework 1).

- React 19 + Vite, plain JavaScript
- React Router v7 (declarative mode) with route-level code splitting
- Deep-linkable category filters and lightbox via `useSearchParams` (`?category=devices&photoId=dev-03`)
- Native `<dialog>` lightbox, native CSS, WCAG 2.2 AA target

See [project-rules.md](project-rules.md) for standards and [TASK_DECOMPOSITION.md](TASK_DECOMPOSITION.md) for the plan.

## Scripts

```bash
npm install
npm run dev        # dev server
npm run build      # production build to dist/
npm run preview    # serve the production build (http://localhost:4173)
npm test           # run tests once
npm run test:watch # tests in watch mode
npm run lint       # ESLint
```
