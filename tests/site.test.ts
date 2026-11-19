/** The site's routes: each course at /<teaching locale>/<id>/, the front and about pages in every locale, and the sitemap. */
import { describe, expect, it } from "vitest";
import { LOCALES } from "@lumenary/core/i18n";
import { courses, href, routing } from "@/lib/site";
import sitemap from "@/app/sitemap";

describe("routing", () => {
  it("puts each course in its teaching locale only", () => {
    expect(href("es", "spanish")).toBe("/en/spanish/");
    expect(href("en", "ingles")).toBe("/es/ingles/");
    expect(href("ar", "ingles/quien-eres")).toBe("/es/ingles/quien-eres/");
    expect(href("hi", "about")).toBe("/hi/about/");
    expect(href("zh-Hans")).toBe("/zh-Hans/");
  });
  it("sends the language menu to the front page when a course is not taught in the language picked", () => {
    expect(routing.switchHref("es", "ingles/quien-eres/")).toBe("/es/ingles/quien-eres/");
    expect(routing.switchHref("sw", "ingles/quien-eres/")).toBe("/sw/");
    expect(routing.switchHref("ar", "about/")).toBe("/ar/about/");
  });
});

describe("the sitemap", () => {
  const urls = sitemap().map((u) => u.url);
  const lessons = courses.getCourses().reduce((n, c) => n + c.slugs.length, 0);
  it("lists every page once, on lingua.lumenary.academy", () => {
    expect(urls.every((u) => u.startsWith("https://lingua.lumenary.academy/") && u.endsWith("/"))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.length).toBe(LOCALES.length * 2 + courses.getCourses().length + lessons);
  });
  it("never lists a course page outside its teaching locale", () => {
    expect(urls).toContain("https://lingua.lumenary.academy/es/ingles/");
    expect(urls).toContain("https://lingua.lumenary.academy/en/spanish/sounds-and-greetings/");
    expect(urls.some((u) => /\/(?!es\/)[a-zA-Z-]+\/ingles\//.test(u.replace("https://lingua.lumenary.academy", "")))).toBe(false);
  });
});
