import type { LoadedCourse } from "@lumenary/core/course";

/**
 * Lumenary Lingua's language pairs: the language learned and the languages it is (or will be) taught
 * in, as BCP 47 tags; names are shown in the reader's language from CLDR. The planned pairs follow
 * the main site's divisions page; a pair is available once a course for it exists.
 */
export const PAIRS: { learn: string; via: string[] }[] = [
  { learn: "en", via: ["en"] },
  { learn: "en", via: ["es"] },
  { learn: "en", via: ["zh", "hi", "ar", "fr", "pt", "bn", "ru", "id", "sw"] },
  { learn: "fr", via: ["en", "ar"] },
  { learn: "es", via: ["en"] },
  { learn: "es", via: ["pt"] },
  { learn: "zh", via: ["en"] },
  { learn: "ar", via: ["en", "fr"] },
  { learn: "hi", via: ["en"] },
  { learn: "pt", via: ["en", "es"] },
  { learn: "de", via: ["en"] },
  { learn: "ja", via: ["en"] },
  { learn: "ru", via: ["en"] },
];

/** The course for a pair, if one is published: a course learning `learn` taught in `via`. */
export function courseFor(courses: LoadedCourse[], learn: string, via: string): LoadedCourse | undefined {
  const base = (tag: string | undefined) => tag?.toLowerCase().split("-")[0];
  return courses.find((c) => base(c.course.learn) === learn && base(c.course.locale) === via);
}
