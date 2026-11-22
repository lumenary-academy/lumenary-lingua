/** Links from Lumenary Lingua to the rest of Lumenary Academy and to its own source. */
export { ACADEMY_URL, PREP_URL, SCIENTIA_URL } from "@lumenary/core/site";

/** The canonical origin of this site, for metadata and the sitemap. */
export const SITE_URL = "https://lingua.lumenary.academy";

/**
 * Tutors and classes on Gideon Tasks, a separate marketplace run by Gideon Solutions, LLC. The site
 * links it once, from one section of the front page, and never from a lesson.
 */
export const TUTORING_URL = "https://www.gideontasks.com/tutoring";

export const SOURCE_URL = "https://github.com/lumenary-academy/lumenary-lingua";
export const CODE_LICENCE_URL = `${SOURCE_URL}/blob/main/LICENSE`;
export const CONTENT_LICENCE_URL = `${SOURCE_URL}/blob/main/LICENSE-CONTENT`;

/** A page of lumenary.academy in a locale (its pages exist in all six). */
export const academyPage = (locale: string, path = "") => `https://lumenary.academy/${locale}/${path}`;
