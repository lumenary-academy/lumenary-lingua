/** Links from Lumenary Lingua to the rest of Lumenary Academy and to its own source. */
import { PREP_URL } from "@lumenary/core/site";
export { ACADEMY_URL, PREP_URL, SCIENTIA_URL } from "@lumenary/core/site";

/** The canonical origin of this site, for metadata and the sitemap. */
export const SITE_URL = "https://lingua.lumenary.academy";

/**
 * Tutors and classes on Gideon Tasks, a separate marketplace run by Gideon Solutions, LLC. The site
 * links it once, from one section of the front page, and never from a lesson.
 */
export const TUTORING_URL = "https://www.gideontasks.com/tutoring";

/**
 * The owner's other projects, listed under a blunt disclosure in one section of the front page, "From
 * the same owner" (#same-owner, `lingua.sameOwner.*`, one line each), right after "Tutors & classes",
 * which already covers Gideon Tasks. The footer links that section. They are never linked or named in
 * a lesson, an exercise or a course page. The owner's rule of 22 November 2026, replacing his rule of
 * 19 November 2026 (no promotion beyond "Tutors & classes").
 */
export const OWNER_PROJECTS = [
  { key: "prep", name: "Lumenary Prep", url: PREP_URL },
  { key: "games", name: "Peace Cat Games", url: "https://www.peacecatgames.com" },
  { key: "tax", name: "Gideon Tax", url: "https://www.gideontax.com" },
] as const;

export const SOURCE_URL = "https://github.com/lumenary-academy/lumenary-lingua";
export const CODE_LICENCE_URL = `${SOURCE_URL}/blob/main/LICENSE`;
export const CONTENT_LICENCE_URL = `${SOURCE_URL}/blob/main/LICENSE-CONTENT`;

/** A page of lumenary.academy in a locale (its pages exist in all six). */
export const academyPage = (locale: string, path = "") => `https://lumenary.academy/${locale}/${path}`;
