import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@lumenary/core/i18n/server";
import { CourseLessonPage } from "@lumenary/core/course";
import { courseSite, courses } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.getCourses().flatMap((c) => c.slugs.map((slug) => ({ locale: c.course.locale, course: c.path, slug })));
}

type Params = { params: Promise<{ locale: string; course: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course, slug } = await params;
  const c = courses.getCourse(course, "lingua");
  if (!c?.slugs.includes(slug)) return {};
  const { frontmatter } = courses.getCourseLesson(c, slug);
  return { title: `${frontmatter.title} · ${c.course.title}`, description: frontmatter.subtitle };
}

export default async function LessonPage({ params }: Params) {
  const { course, slug } = await params;
  const locale = await resolveLocale(params);
  const c = courses.getCourse(course, "lingua");
  if (!c || c.course.locale !== locale || !c.slugs.includes(slug)) notFound();
  return <CourseLessonPage c={c} slug={slug} locale={locale} site={courseSite} />;
}
