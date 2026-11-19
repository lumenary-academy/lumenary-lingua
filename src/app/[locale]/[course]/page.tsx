import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@lumenary/core/i18n/server";
import { CourseOverview } from "@lumenary/core/course";
import { courseSite, courses } from "@/lib/site";

export const dynamicParams = false;

/** Each course is generated only in the locale it is taught in: /en/spanish/, /es/ingles/. */
export function generateStaticParams() {
  return courses.getCourses().map((c) => ({ locale: c.course.locale, course: c.path }));
}

type Params = { params: Promise<{ locale: string; course: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = courses.getCourse((await params).course, "lingua");
  return c ? { title: c.course.title, description: c.course.subtitle } : {};
}

export default async function CoursePage({ params }: Params) {
  const { course } = await params;
  const locale = await resolveLocale(params);
  const c = courses.getCourse(course, "lingua");
  if (!c || c.course.locale !== locale) notFound();
  return <CourseOverview c={c} locale={locale} site={courseSite} />;
}
