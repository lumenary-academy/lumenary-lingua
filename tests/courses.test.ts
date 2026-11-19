/**
 * Lumenary Lingua's courses (content/lingua/<id>): every syllabus, lesson and exercise is well formed,
 * every lesson compiles, uses only the components Lingua renders (no cat guides), marks every spoken
 * phrase with its language, and links only to lessons and pages that exist. Ported from the main
 * repository's tests/courses.test.ts.
 */
import { describe, expect, it } from "vitest";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { katexOptions, rehypeKatexHtml } from "@lumenary/core/markdown";
import { CourseFile, CourseLessonFrontmatter, ExercisesFile, type CourseLessonFrontmatter as CourseLessonFrontmatterType, type Exercise } from "@lumenary/core/schema";
import { SECTION_KINDS } from "@lumenary/core/lesson/client";
import { makeLessonComponents } from "@lumenary/core/lesson";
import { LOCALES, makeT } from "@lumenary/core/i18n";
import { RESERVED_PATHS } from "@/lib/site";
import { dirs, exists, fm, json } from "./helpers";

/** The MDX components a Lingua lesson may use. Not <Narrator> (Lingua has no cat guides) nor <TopicLink> (Lumenary Math's). */
const COMPONENTS = new Set(["Section", "Definition", "Theorem", "Proof", "Example", "Misconception", "Note", "Analogy", "Figure", "Reflection", "Viewpoint", "Exercises", "LessonLink", "Say"]);
const MIN_EXERCISES = 6;
/** The six levels of the Common European Framework of Reference for Languages, in order. */
const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ROOT = "content/lingua";
const courseDirs = dirs(ROOT).filter((d) => exists(`${ROOT}/${d}/course.json`)).sort();

/** Every page of the site, for checking Markdown links ("/en/spanish/…/", "/es/"). */
const pages = new Set<string>(LOCALES.flatMap((l) => [`/${l}/`, `/${l}/about/`]));
for (const dir of courseDirs) {
  try {
    const c = CourseFile.parse(json(`${ROOT}/${dir}/course.json`));
    pages.add(`/${c.locale}/${c.id}/`);
    for (const slug of c.levels.flatMap((l) => l.lessons)) pages.add(`/${c.locale}/${c.id}/${slug}/`);
  } catch {
    // an invalid course.json fails its own syllabus test
  }
}

/** The body outside fenced code blocks and inline code spans (where JSX and `$` mean something to MDX). */
function prose(body: string): string {
  return body.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm, "").replace(/(`+)(?!`)[\s\S]*?[^`]\1(?!`)/g, "");
}

/** Markdown links to this site's pages ("/en/spanish/", "/es/ingles/quien-eres/#vocabulario") that do not exist. */
function brokenSiteLinks(markdown: string): string[] {
  return [...markdown.matchAll(/\]\((\/[^)#\s]*)(?:#[^)\s]*)?\)/g)].map((m) => (m[1]!.endsWith("/") ? m[1]! : `${m[1]}/`)).filter((to) => !pages.has(to));
}

it("there are at least the first two courses: Spanish taught in English and English taught in Spanish", () => {
  expect(courseDirs).toEqual(expect.arrayContaining(["spanish", "ingles"]));
});

it("the allowed components are exactly what Lingua's lesson pages render", () => {
  const rendered = new Set([...Object.keys(makeLessonComponents({ t: makeT({}), cats: false })), "LessonLink"]);
  for (const name of COMPONENTS) expect(rendered.has(name), `<${name}> is not rendered`).toBe(true);
  expect(rendered.has("Narrator")).toBe(false);
});

describe.each(courseDirs)("course %s", (dir) => {
  const course = CourseFile.parse(json(`${ROOT}/${dir}/course.json`));
  const slugs = course.levels.flatMap((l) => l.lessons);

  it("has a valid syllabus: unique slugs, every lesson directory listed, the course id matching its directory", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(course.levels.map((l) => l.id)).size).toBe(course.levels.length);
    expect(dirs(`${ROOT}/${dir}/lessons`).sort()).toEqual([...slugs].sort());
    expect(dir).toBe(course.id);
    expect(RESERVED_PATHS, "a course id may not be a page of the site").not.toContain(course.id);
  });

  it("is a Lingua course from A1 to C2, naming the language it teaches", () => {
    expect(course.division).toBe("lingua");
    expect(course.learn, "course.json names the language learned (learn)").toMatch(/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/);
    expect(course.learn!.split("-")[0], "a course teaches another language than the one it is taught in").not.toBe(course.locale.split("-")[0]);
    expect(course.levels.map((l) => l.short)).toEqual(CEFR);
  });

  it("links only to pages that exist in its description", () => {
    expect(course.description.flatMap(brokenSiteLinks)).toEqual([]);
  });

  describe.each(slugs)("%s", (slug) => {
    const base = `${ROOT}/${dir}/lessons/${slug}`;
    const present = exists(`${base}/lesson.mdx`) && exists(`${base}/exercises.json`);
    it("has a lesson.mdx and an exercises.json", () => expect(present).toBe(true));
    if (!present) return;
    // A lesson whose files don't parse fails its own test, not the whole suite's collection.
    let loaded: { front: CourseLessonFrontmatterType; body: string; exercises: Exercise[] } | Error;
    try {
      const doc = fm(`${base}/lesson.mdx`);
      loaded = { front: CourseLessonFrontmatter.parse(doc.data), body: doc.content, exercises: ExercisesFile.parse(json(`${base}/exercises.json`)).exercises };
    } catch (err) {
      loaded = err instanceof Error ? err : new Error(String(err));
    }
    it("has frontmatter and exercises that parse", () => expect(loaded instanceof Error ? loaded.message : "ok").toBe("ok"));
    if (loaded instanceof Error) return;
    const { front, body, exercises } = loaded;

    it("has valid frontmatter and builds only on earlier lessons", () => {
      for (const p of front.prerequisites) {
        expect(slugs.indexOf(p), `prerequisite ${p}`).toBeGreaterThanOrEqual(0);
        expect(slugs.indexOf(p), `prerequisite ${p} comes later`).toBeLessThan(slugs.indexOf(slug));
      }
      expect(front.related, "Lingua lessons cannot link Lumenary Math topics").toEqual([]);
      expect(front.narrators, "Lingua lessons have no cat guides").toEqual([]);
      for (const r of front.references) if (r.url) expect(r.url, r.title).toMatch(/^https:\/\//);
    });

    it("has enough well-formed exercises", () => {
      const file = ExercisesFile.parse(json(`${base}/exercises.json`));
      expect(file.lesson).toBe(slug);
      expect(exercises.length).toBeGreaterThanOrEqual(MIN_EXERCISES);
      expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
      for (const ex of exercises) {
        if (ex.type === "choice") {
          const correct = ex.options.filter((o) => o.correct).length;
          if (ex.multiple) expect(correct, ex.id).toBeGreaterThanOrEqual(1);
          else expect(correct, `${ex.id}: a single-answer question has exactly one correct option`).toBe(1);
          expect(new Set(ex.options.map((o) => o.id)).size, `${ex.id}: option ids`).toBe(ex.options.length);
        }
        if (ex.type === "text") expect(ex.lang, `${ex.id} needs lang`).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
      }
    });

    it("uses only Lingua's components, valid sections, and links that exist", () => {
      const text = prose(body);
      const used = new Set([...text.matchAll(/<([A-Z][A-Za-z]*)\b/g)].map((m) => m[1]!));
      for (const name of used) expect(COMPONENTS.has(name), `<${name}> is not available in Lingua lessons`).toBe(true);
      expect(text, "Lingua lessons have no cat guides").not.toMatch(/<Narrator\b/);
      const sections = [...text.matchAll(/<Section\b([^>]*)>([\s\S]*?)<\/Section>/g)].map((m): { id?: string; kind?: string; title?: string; inner: string } => ({ ...Object.fromEntries([...m[1]!.matchAll(/(\w+)="([^"]*)"/g)].map((a) => [a[1], a[2]])), inner: m[2]! }));
      expect(sections.length).toBeGreaterThanOrEqual(3);
      expect(new Set(sections.map((s) => s.id)).size).toBe(sections.length);
      for (const s of sections) {
        expect(s.id && s.title, "every Section has an id and a title").toBeTruthy();
        expect(Object.keys(SECTION_KINDS), `kind "${s.kind}"`).toContain(s.kind);
      }
      expect((text.match(/<Exercises\s*\/>/g) ?? []).length, "one <Exercises/>").toBe(1);
      expect((text.match(/<Reflection\b/g) ?? []).length, "at most one optional reflection").toBeLessThanOrEqual(1);
      expect(sections.some((s) => s.kind === "exercises" && /<Exercises\s*\/>/.test(s.inner)), "<Exercises/> sits in a section of kind exercises").toBe(true);
      for (const m of text.matchAll(/<LessonLink\s+slug="([^"]+)"/g)) expect(slugs, `LessonLink ${m[1]}`).toContain(m[1]);
      expect(brokenSiteLinks(text), "links to pages of this site").toEqual([]);
      for (const m of text.matchAll(/<Say\b([^>]*)>/g)) expect(m[1], "<Say> needs lang").toMatch(/lang="[a-z]{2}(-[A-Z]{2})?"/);
    });

    it("compiles as MDX with valid maths", async () => {
      const file = await compile(body, { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [[rehypeKatex, katexOptions], rehypeKatexHtml] });
      const katex = file.messages.filter((m) => m.source === "rehype-katex");
      expect(katex.map((m) => m.reason)).toEqual([]);
    });
  });
});
