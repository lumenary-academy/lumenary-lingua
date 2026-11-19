# Lumenary Lingua

**Languages, each taught through a language you already know.**

Lumenary Lingua is the language division of [Lumenary Academy](https://lumenary.academy), a Christian-inspired education project in three divisions: Lumenary Scientia (the sciences), Lumenary Lingua (languages) and Lumenary Prep (exam preparation). Lingua is free and open source: no accounts, no advertising. This repository holds its website, [lingua.lumenary.academy](https://lingua.lumenary.academy), and its courses.

| Course | Taught in | Levels | Pages |
| --- | --- | --- | --- |
| Spanish, taught in English (`content/lingua/spanish/`) | English | A1 to C2, 36 lessons | `/en/spanish/` |
| Inglés, enseñado en español (`content/lingua/ingles/`) | Spanish | A1 to C2, 36 lessons | `/es/ingles/` |

Each course follows the six levels of the Common European Framework of Reference for Languages, six lessons per level. Every lesson was drafted with AI assistance and is awaiting review by a human teacher of the language, as the site says on every course page. More language pairs are planned; the front page lists them.

## Running it locally

Requirements: Node 22 or later (CI uses Node 24).

The site depends on a tagged release of [@lumenary/core](https://github.com/lumenary-academy/lumenary-core), installed from its release tarball (see `package.json`):

```bash
git clone https://github.com/lumenary-academy/lumenary-lingua.git
cd lumenary-lingua
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm test             # courses, lessons, exercises, links, safety, i18n, routes
npm run build        # static export to out/
npm start            # serve out/ at http://localhost:4173
```

Changes to the linked core show up in `npm run dev` straight away.

## Structure

```
content/lingua/<course>/          a course: course.json (its syllabus) and lessons/<slug>/{lesson.mdx,exercises.json}
src/app/(root)/                   / : picks a language (remembered choice, browser preferences, English)
src/app/[locale]/page.tsx         /<locale>/ : the front page, in every locale: what Lingua is, its courses, language pairs, the academy
src/app/[locale]/[course]/        /<locale>/<course>/ and …/<slug>/ : a course and its lessons, only in the course's teaching locale
src/app/[locale]/about/           /<locale>/about/
src/app/[locale]/not-found.tsx    the not-found message in the reader's language
src/app/global-not-found.tsx      404.html, for any address that matches no page
src/app/sitemap.ts                /sitemap.xml, on https://lingua.lumenary.academy
src/lib/site.ts                   the site put together from @lumenary/core: strings, course loader, routing, course pages
src/lib/links.ts                  links to the rest of Lumenary Academy and to this repository
src/lib/pairs.ts                  the planned language pairs
src/i18n/messages/<locale>.json   Lingua's own interface strings, in en, es, ar, hi, sw, zh-Hans
tests/                            vitest suites
```

A course's pages exist only in the locale it is taught in: Spanish (taught in English) at `/en/spanish/`, English (taught in Spanish) at `/es/ingles/`. Links from every other locale point there, and the language menu sends a reader whose course is not taught in the language they pick to that language's front page.

## How it uses @lumenary/core

Nearly all the code is shared with the other Lumenary sites through [@lumenary/core](https://github.com/lumenary-academy/lumenary-core):

- **Design and chrome**: `@lumenary/core/styles.css`, `/katex` and `/fonts` in the layout; `SiteHeader` (wordmark "Lumenary Lingua", Courses, About, language menu, theme switch) and `SiteFooter` from `/site`.
- **Languages**: the six locales and the shared interface strings from `/i18n`; `src/lib/site.ts` lays Lingua's own strings over them with `createI18n`.
- **Courses**: `createCourseLoader` reads `content/lingua`; `CourseOverview` and `CourseLessonPage` render a course and its lessons with the shared lesson components, `<Say>` and the exercise engine (`cats: false`: Lingua has no cat guides).
- **Routing**: `createRouting` maps each course to its teaching locale; the layout passes the same description to the header's language menu.

`next.config.ts` lists the core in `transpilePackages` (it ships TypeScript) and, while it is linked from `../lumenary-core`, lets Turbopack read it (`turbopackAdditionalRoots`). `src/app/globals.css` imports Tailwind and the core's stylesheet and points Tailwind's `@source` at the core.

To update the core: set `"@lumenary/core": "https://github.com/lumenary-academy/lumenary-core/archive/refs/tags/vX.Y.Z.tar.gz"` and run `npm install`. (A release tarball installs over HTTPS with an integrity hash, so CI and Vercel need no Git access.) To work on the core and this site together, point it at a checkout instead (`"file:../lumenary-core"`, after `npm install` in the core): `next.config.ts` then lets Turbopack read the linked package (`turbopackAdditionalRoots`).

## Translations needing native review

Every non-English interface string is an unreviewed machine draft. Most come from the main Lumenary repository's catalogues. These were written for this site and have had no review at all; please check them in `src/i18n/messages/{es,ar,hi,sw,zh-Hans}.json`:

- `nav.courses`, `nav.short.courses`
- `lingua.eyebrow`, `lingua.coursesTitle`, `lingua.learn`, `lingua.taughtIn`
- `lingua.howTitle`, `lingua.howLevels`, `lingua.howLessons`, `lingua.howListen`, `lingua.howFree`
- `lingua.pairsTitle`, `lingua.pairsLead`, `lingua.pairLearn`, `lingua.pairVia`, `lingua.pairStatus`
- `lingua.academyTitle`, `lingua.here`, `lingua.visitAcademy`, `lingua.footerMission`
- `lingua.about.title`, `lingua.about.lead`, `lingua.about.what`, `lingua.about.free`, `lingua.about.review`, `lingua.about.reflection`, `lingua.about.source`
- `lingua.notFound.title`, `lingua.notFound.text`, `lingua.notFound.home`
- in @lumenary/core: `footer.openSource`, `footer.sourceCode`, `footer.codeLicence`, `footer.contentLicence`

Language names (Spanish, inglés, 西班牙语…) are not translated by hand: they come from the Unicode CLDR data built into Node.js (`Intl.DisplayNames`) when the site is built. The 404 page and the language-picking root page are in English, because they cannot know the reader's language; they link every locale's front page by its own name.

## Contributing

Teachers of Spanish and English are the most needed reviewers right now: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Licences

- Code (the website, scripts, tests): [Apache-2.0](LICENSE).
- Educational content (lesson text, dialogues, exercises, solutions, diagrams): [CC BY-SA 4.0](LICENSE-CONTENT).

Lumenary Academy is an independent project. No institutional endorsement is implied.
