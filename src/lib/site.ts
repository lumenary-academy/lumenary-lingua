import "server-only";
import path from "node:path";
import { createI18n } from "@lumenary/core/i18n/server";
import { createCourseLoader, type CourseSite } from "@lumenary/core/course";
import { createRouting, type RoutingConfig } from "@lumenary/core/routing";
import en from "@/i18n/messages/en.json";

/**
 * Lumenary Lingua, put together from @lumenary/core: its message catalogue (the shared strings plus
 * Lingua's own), its courses (content/lingua/<id>, each at /<teaching locale>/<id>/), the routing that
 * follows from them, and the course pages' settings.
 */

/** Lingua's strings (src/i18n/messages) laid over the strings every Lumenary site shares. */
export const i18n = createI18n({
  en,
  locales: {
    es: () => import("@/i18n/messages/es.json"),
    ar: () => import("@/i18n/messages/ar.json"),
    hi: () => import("@/i18n/messages/hi.json"),
    "zh-Hans": () => import("@/i18n/messages/zh-Hans.json"),
    sw: () => import("@/i18n/messages/sw.json"),
  },
});

/** The courses: every directory of content/lingua with a course.json. Its site path is its id: /en/spanish/. */
export const courses = createCourseLoader({ root: path.join(process.cwd(), "content/lingua") });

/** Paths that are pages of the site itself, so no course may take them as its id. */
export const RESERVED_PATHS = ["about"];

/**
 * Each course's pages exist only in the locale it is taught in, so links from other locales point
 * there; the language menu sends a reader whose course is not taught in the language they pick to
 * that language's front page, which lists every course.
 */
export const routingConfig: RoutingConfig = {
  courses: courses.courseLocales(),
  fallbacks: Object.fromEntries(courses.getCourses().map((c) => [c.path, ""])),
};
export const routing = createRouting(routingConfig);
export const { href } = routing;

/** The course and lesson pages. Lingua has no cat guides. */
export const courseSite: CourseSite = { courses, i18n, routing, cats: false };
