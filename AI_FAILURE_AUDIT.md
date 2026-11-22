# AI Failure Audit

Log of cases where AI-generated output was wrong, incomplete or misleading, and how each was caught and fixed.

> **Note:** Entries must be real. Only record failures that actually happened during this project, with real dates, verification steps and commit references. Do not invent or pre-fill entries.

All entries below come from the AI-assisted session of 2026-11-22. Tests written first and committed as intentionally failing (the "red" commits `4e2252a`, `034dcf4`, `af31ad5`) are part of the workflow, not failures, and are not listed.

| Date | Prompt/Area | What the AI produced | Why it was wrong | How it was verified | Fix/commit |
| --- | --- | --- | --- | --- | --- |
| 2026-11-22 | Scaffold: `npm test` with no tests | Vitest config without `passWithNoTests`. | The assignment says an empty suite must pass, but Vitest exits with code 1 when no test files are found. | Ran `npm test` and saw "No test files found, exiting with code 1". | Added `passWithNoTests: true` before the commit: `d923663`. |
| 2026-11-22 | Lecturer slide contract: closing the lightbox | The slide's `setSearchParams({})` (known contract issue, from the slide rather than invented by the AI; the implementation deliberately avoids it). | It replaces all params, wiping the `category` filter when a photo is closed. | Test "removes only photoId and keeps category when the close button is clicked" and the Esc, backdrop and Back variants in `lightbox.test.jsx`. | Closing uses `setSearchParams(prev => { prev.delete('photoId'); return prev })`: `78d9ea1`. |
| 2026-11-22 | Testing environment: native `<dialog>` | The lightbox design relies on `showModal()` / `close()`. | jsdom does not implement `HTMLDialogElement.showModal/close`, so any dialog test would throw. | Known limitation, handled up front; the dialog tests only pass because of the polyfill (toggles `open`, dispatches `close`). | Polyfill in `src/test/setup.js`: `d923663`. Real-browser behavior still needs manual verification (see below). |
| 2026-11-22 | Filter tests: location probe | A `LocationProbe` rendering `<output>`. | `<output>` has an implicit `status` role, so `getByRole('status')` for the result-count live region matched two elements. | `gallery-filter.test.jsx` run: "Found multiple elements with the role status". | Probe changed to a `<span>`: `c1185f3`. |
| 2026-11-22 | Lightbox test: expected date | Test expected `takenAt` `2026-03-11` for `dev-03`. | Wrong guess; the catalog value is `2026-09-11`. | Looked up `takenAt` of `dev-03` in `src/data/photos.js` after reviewing the test. | Corrected before the red commit: `af31ad5`. |
| 2026-11-22 | Lightbox markup | The `<dl>` repeated the case reference already shown in the figcaption. | Redundant content (screen readers read it twice) and ambiguous queries: `getByText('CASE-2026-DEV-03')` found multiple elements. | Failing test "opens a dialog with the selected photo for a valid photoId". | Replaced that `<dl>` row with "Format: WebP": `78d9ea1`. |
| 2026-11-22 | Contrast test helper | Regex built with `\s` inside a template literal, and the CSS read via `new URL(..., import.meta.url)`. | In a template literal `\s` becomes plain `s`, so no token matched; under the jsdom environment `import.meta.url` is not a `file:` URL, so the file read failed. | Contrast tests errored with "Missing color token" and a file read error. | Used a literal-space pattern and `readFileSync('src/index.css')`: `6357870`. |
| 2026-11-22 | Styles: control borders | Buttons and photo cards used `--color-border` (`#c4c9ce`) for their borders. | About 1.7:1 against the page background, below the 3:1 required for UI component boundaries (WCAG 1.4.11). | New contrast test failed for the control-border token until it existed; ratios computed from the tokens. | Added `--color-control-border` (`#5f6670`): `6357870`. |
| 2026-11-22 | Skeleton and layout | Skeleton and gallery page used a fixed `40rem` min-height and no reserved scrollbar. | Real page is much taller than the skeleton, and the scrollbar appearing shifted `main` sideways: Lighthouse reported CLS 0.717 and Performance 77. | Lighthouse desktop run on the production preview; the layout-shift audit pointed at `main#main`. | `scrollbar-gutter: stable`, 100vh min-heights for the gallery and its skeleton, more eager first-row images: `92bf3ae` (CLS 0, desktop Performance 100). |

## Manual verification notes (student)

> To be filled in by the student. Suggested items: keyboard-only walkthrough of the lightbox in a real browser (Esc, arrows, Tab order, focus return), screen reader check (NVDA/VoiceOver) of the dialog and live regions, Back/Forward behavior with deep links, native `<dialog>` behavior vs. the jsdom polyfill, and your own Lighthouse runs.

| Date | What was checked | Browser / tool | Result | Notes |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
