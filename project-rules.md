# Project Rules

Coding standards for the Production Multi-Route Photo & Evidence Gallery SPA (UIT Lab 4, HW1).

## Stack constraints

- Vite + React 19, plain JavaScript (`.jsx`). No TypeScript.
- React Router v7, installed as `react-router`; import from `'react-router'` only. Declarative mode (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`).
- Native CSS only (Grid + `@media`). No UI library, CSS framework or web-font package. System font stack.
- Tests: Vitest + Testing Library + user-event + jsdom. Lint: ESLint flat config with react-hooks rules.
- Scripts must work on Windows and POSIX (no shell-specific syntax in `package.json`).

## 4-stage contract-first loop

Every feature goes through these stages, in order:

1. **Contract** - write down the behavior: props, URL shape, ARIA roles/names, edge cases.
2. **Failing test** - encode the contract as a test and watch it fail for the right reason.
3. **Minimal implementation** - write the least code that makes the test pass.
4. **Refactor** - clean up with tests green; no behavior changes.

## Commits

- Conventional Commits: `type(scope): subject` (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`, `build`).
- One concern per commit. Do not mix refactors with features or docs with code.
- Imperative, lowercase subject, no trailing period.
- Never squash. Never push unless explicitly asked.
- Tick the matching checkbox in `TASK_DECOMPOSITION.md` in the same commit as the work.

## Deprecated vs. modern

| Deprecated / avoid | Use instead |
| --- | --- |
| React Router v5 (`<Switch>`, `component={...}`, `exact`, `activeClassName`, `useHistory`) | React Router v7: `<Routes>`, `<Route element={...}>`, `NavLink className={({ isActive }) => ...}`, `useNavigate` |
| `react-router-dom` imports | `import { ... } from 'react-router'` |
| `Component.defaultProps` | Default parameters: `function Card({ size = 'md' })` |
| `react-media` / JS media-query hooks | CSS `@media` and container queries |
| `typeface-*` font packages | System font stack, or self-hosted `@font-face` if ever needed |
| Material UI v4 / component libraries | Semantic HTML + native CSS |
| Modal libraries | Native `<dialog>` with `showModal()` / `close()` |

## State and effects

- **No `useEffect` for derived state.** Compute values during render (or `useMemo` if truly expensive). Derive filter results and the selected photo from `useSearchParams()` directly.
- Reserve `useEffect` for syncing with external systems (e.g. calling `dialog.showModal()`).
- URL is the source of truth for filters and the open photo (`?category=devices&photoId=dev-03`).

## Accessibility (WCAG 2.2 AA)

- Every icon-only button has an `aria-label`.
- Visible `:focus-visible` style on every interactive element; never `outline: none` without a replacement.
- Interactive target size >= 24x24 CSS px.
- Text contrast >= 4.5:1 (3:1 for large text and UI components).
- Respect `prefers-reduced-motion`.
- Images have meaningful `alt` text; decorative images use `alt=""`.
- Use semantic landmarks (`header`, `nav`, `main`, `footer`) and one `h1` per route.
- Skeleton fallbacks match final dimensions (CLS = 0) and carry `aria-busy="true"` and `aria-live="polite"`.
