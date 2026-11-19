# Contributing to Lumenary Lingua

Thank you. The most valuable contribution right now is a **teacher's review**. Every lesson was drafted with AI assistance and no human teacher has checked it yet. If you teach Spanish or English (or are a careful native speaker), you can help even without touching any code.

## Reviewing a lesson

1. Pick a lesson on the site: [Spanish, taught in English](https://lingua.lumenary.academy/en/spanish/) or [Inglés, enseñado en español](https://lingua.lumenary.academy/es/ingles/).
2. Read it as you would a textbook chapter for your students. Look for:
   - mistakes in the target language: grammar, spelling, accents, register, unnatural phrasing;
   - explanations that are wrong, misleading or too hard for the level (A1 to C2);
   - exercises whose accepted answers are too strict (a correct variant is rejected) or too loose;
   - regional usage stated as if it were universal, or one variety ranked above another (Spain and Latin America; British, American and other Englishes).
3. Report what you find, in English or Spanish:
   - **Without GitHub tools**: open an issue on this repository and name the lesson and the passage.
   - **With GitHub**: edit the files below and open a pull request. Say in it what you checked and which lessons you reviewed; please do not mark anything as reviewed in the files themselves.

## Where things are

Each lesson is a folder `content/lingua/<course>/lessons/<slug>/` with two files:

- `lesson.mdx`: the lesson. Text is Markdown; sections and blocks are written as tags (`<Section …>`, `<Note>`, `<Misconception>`, `<Example>`). A word the browser can read aloud is wrapped as `<Say lang="es">hola</Say>`; keep the `lang` (`es`, `en`, `es-MX`, `en-GB` …) and put plain text inside.
- `exercises.json`: the exercises. A `choice` exercise lists its `options`, each with `correct` and `feedback` saying why it is right or wrong. A `text` exercise lists every accepted answer in `answers` (with and without contractions, for example) and the answer's language in `lang`. Case, spacing and the punctuation around a sentence (¿ ¡ . ?) are ignored; accents are not, and a learner who misses only an accent is told so.

The syllabus, with each level's lessons in order, is `content/lingua/<course>/course.json`.

## Rules for lesson content

- **Original text only.** Dialogues, texts, examples and exercises are written for Lumenary Lingua. Literary quotations come only from works in the public domain (Cervantes, Bécquer, Austen, Dickens, Shakespeare …), short and credited. No song lyrics, film scripts or modern literature.
- **Each language through one the learner knows**: explanations in the course's teaching language; at A1 and A2 target-language passages are short and fully glossed; at C1 and C2 most of a lesson may be in the target language.
- **Point out regional differences without ranking them.**
- **Kind feedback**: "Not yet: …" rather than "Wrong".
- Exercises: at least six per lesson, mixing `choice` and `text`, and every hint and solution explains rather than just giving the answer.
- Optional Christian reflections (`<Reflection>`) are at most one per lesson, collapsed, never required to follow the lesson.
- Lingua has no cat guides: no `<Narrator>`.

## Checking your changes

```bash
npm test          # every syllabus, lesson and exercise file, links, <Say> languages, safety, interface strings
npm run dev       # then open the lesson at http://localhost:3000/en/spanish/<slug>/ or /es/ingles/<slug>/
```

See the README for setting up the two repositories. Interface strings (buttons, menus) are in `src/i18n/messages/<locale>.json`; corrections to the Arabic, Hindi, Swahili and Chinese ones are very welcome too.

Code is licensed under Apache-2.0 and lesson content under CC BY-SA 4.0; by contributing you agree to publish your contribution under those licences. Be kind and precise: everyone is welcome, whatever their country, culture or belief.
