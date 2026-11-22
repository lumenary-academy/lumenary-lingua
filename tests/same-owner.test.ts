/**
 * From the same owner: the owner's other projects (OWNER_PROJECTS in src/lib/links.ts), on his rule of
 * 22 November 2026, which replaced his rule of 19 November 2026 that the site carry no promotion beyond
 * "Tutors & classes". One plain section of the front page, right after "Tutors & classes", in every
 * locale, says bluntly that Lumenary Academy's owner runs them, that some charge money, and that they
 * are listed because they are his; each has one honest line and one link. The footer links the section
 * once on every page. No lesson, exercise or course links or names them.
 */
import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES, makeT } from "@lumenary/core/i18n";
import { i18n } from "@/lib/site";
import { OWNER_PROJECTS, PREP_URL, TUTORING_URL } from "@/lib/links";
import LinguaHome from "@/app/[locale]/page";
import LocaleLayout from "@/app/[locale]/layout";
import { ROOT } from "./helpers";

// The layout's chrome outside Next: no router, and no next/font.
vi.mock("next/navigation", () => ({ usePathname: () => "/en/", useRouter: () => ({ push() {}, replace() {}, prefetch() {} }) }));
vi.mock("@lumenary/core/fonts", () => ({ fontVariables: "" }));

const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const count = (html: string, s: string) => html.split(s).length - 1;
const KEYS = ["title", "disclosure", ...OWNER_PROJECTS.map((p) => p.key)];

describe.each(LOCALES)("the same-owner section in %s", (locale) => {
  it("follows Tutors & classes on the front page, once, with the disclosure, a line and one link per project", async () => {
    const html = decode(renderToStaticMarkup(await LinguaHome({ params: Promise.resolve({ locale }) })));
    const t = makeT(await i18n.getMessages(locale));
    expect(count(html, 'id="same-owner"')).toBe(1);
    expect(html.indexOf('id="same-owner"')).toBeGreaterThan(html.indexOf('id="tutors"'));
    const start = html.indexOf('id="same-owner"');
    const section = html.slice(start, html.indexOf("</section>", start));
    for (const key of KEYS) expect(section, key).toContain(t(`lingua.sameOwner.${key}`));
    for (const p of OWNER_PROJECTS) {
      expect(section, p.name).toContain(p.name);
      expect(count(section, `href="${p.url}"`), p.url).toBe(1);
    }
    // The section never repeats Gideon Tasks, which Tutors & classes covers.
    expect(section).not.toContain(TUTORING_URL);
    // Peace Cat Games and Gideon Tax are linked nowhere else on the page (Lumenary Prep, a division, also has its card).
    for (const p of OWNER_PROJECTS.filter((p) => p.url !== PREP_URL)) expect(count(html, p.url), p.url).toBe(1);
  });

  it("keeps the brands untranslated, says Lumenary Prep's price, and names no other", async () => {
    const t = makeT(await i18n.getMessages(locale));
    expect(t("lingua.sameOwner.disclosure")).toContain("Lumenary Academy");
    expect(t("lingua.sameOwner.prep")).toContain("Lumenary Academy");
    expect(t("lingua.sameOwner.prep")).toContain("$50");
    for (const key of ["title", "disclosure", "games", "tax", "footer"]) expect(t(`lingua.sameOwner.${key}`), key).not.toMatch(/[$€£₹¥]|\d/);
    for (const key of [...KEYS, "footer"]) expect(t(`lingua.sameOwner.${key}`), key).not.toMatch(/The Lumenary/);
  });

  it("is linked once from the footer, which links none of the projects themselves", async () => {
    const t = makeT(await i18n.getMessages(locale));
    const html = decode(renderToStaticMarkup(await LocaleLayout({ children: null, params: Promise.resolve({ locale }) })));
    const footer = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));
    // next/link drops the trailing slash outside the build, which exports with trailingSlash: true.
    expect(footer.match(new RegExp(`href="/${locale}/?#same-owner"`, "g"))).toHaveLength(1);
    expect(footer).toContain(t("lingua.sameOwner.footer"));
    expect(count(html, "#same-owner")).toBe(1);
    for (const p of OWNER_PROJECTS.filter((p) => p.url !== PREP_URL)) expect(html).not.toContain(p.url);
  });
});

describe("lessons", () => {
  const walk = (dir: string): string[] =>
    fs.readdirSync(path.join(ROOT, dir), { recursive: true, encoding: "utf8" }).map((f) => path.join(dir, f)).filter((f) => fs.statSync(path.join(ROOT, f)).isFile());
  const read = (f: string) => fs.readFileSync(path.join(ROOT, f), "utf8");

  it("Peace Cat Games and Gideon Tax are linked from the front page only", () => {
    const linking = [...walk("src"), ...walk("content")].filter((f) => /peacecatgames|gideontax\.com|OWNER_PROJECTS/.test(read(f)));
    expect(linking.sort()).toEqual([path.join("src", "app", "[locale]", "page.tsx"), path.join("src", "lib", "links.ts")]);
  });

  it("no lesson, exercise or course links or names any of the owner's projects", () => {
    const lessons = walk("content");
    expect(lessons.length).toBeGreaterThan(100);
    const promo = /prep\.lumenary\.academy|peacecatgames|gideontax\.com|gideontasks|Lumenary Prep|Peace Cat Games|Gideon Tax\b|Gideon Tasks/;
    expect(lessons.filter((f) => promo.test(read(f)))).toEqual([]);
  });
});
