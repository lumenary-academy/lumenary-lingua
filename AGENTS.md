<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## This repository

Lumenary Lingua (lingua.lumenary.academy), a static Next.js site. Shared code (design system, header and footer, i18n, lesson components, course pages, exercises) lives in `@lumenary/core` (github.com/lumenary-academy/lumenary-core); change it there, not by copying it here. The README describes the layout; CONTRIBUTING.md and `npm test` the rules for lessons.

- The brand is "Lumenary Academy", never "The Lumenary"; this division is "Lumenary Lingua".
- Lingua has no cat guides: no `<Narrator>` in lessons.
- Promotion, by the owner's rule of 22 November 2026 (it replaces his rule of 19 November 2026: no promotion beyond "Tutors & classes"): the front page has one plain, bluntly disclosed section of the owner's other projects, "From the same owner", right after "Tutors & classes", and the footer links it once. That and "Tutors & classes" are the only promotion (Lumenary Prep also keeps its place among the academy's divisions), and never inside a lesson, an exercise or a course page. See the README; `tests/same-owner.test.ts` and `tests/tutors.test.ts` check it.
- Interface strings go in all six `src/i18n/messages/*.json`; never redefine a key `@lumenary/core` already has.
- Before a pull request: `npm run typecheck`, `npm test`, `npm run build`.
