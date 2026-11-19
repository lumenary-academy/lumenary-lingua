import type { MetadataRoute } from "next";
import { LOCALES } from "@lumenary/core/i18n";
import { courses, href } from "@/lib/site";
import { SITE_URL } from "@/lib/links";

export const dynamic = "force-static";

/** Every page (static export writes this to /sitemap.xml): the front and about pages in every locale, each course in its own. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "about/", ...courses.getCourses().flatMap((c) => [`${c.path}/`, ...c.slugs.map((s) => `${c.path}/${s}/`)])];
  // href() maps a course's pages to the one locale they exist in; list each page once.
  const urls = new Set(LOCALES.flatMap((locale) => paths.map((p) => `${SITE_URL}${href(locale, p)}`)));
  return [...urls].map((url) => ({ url }));
}
