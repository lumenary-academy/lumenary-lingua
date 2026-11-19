import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Atom, BookOpen, GraduationCap, Languages, Layers, Unlock, Volume2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LOCALE_META, languageName } from "@lumenary/core/i18n";
import { resolveLocale } from "@lumenary/core/i18n/server";
import { DIVISIONS } from "@lumenary/core/brand";
import { mdInline } from "@lumenary/core/markdown";
import { courses, href, i18n } from "@/lib/site";
import { PAIRS, courseFor } from "@/lib/pairs";
import { PREP_URL, SCIENTIA_URL, academyPage } from "@/lib/links";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await i18n.getT(await resolveLocale(params));
  return { description: t("lingua.lead") };
}

const external = <ArrowUpRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />;

function Division({ Icon, accent, name, what, badge, text, action }: { Icon: LucideIcon; accent: string; name: string; what: string; badge?: string; text?: string; action?: React.ReactNode }) {
  return (
    <article className="card relative flex h-full flex-col overflow-hidden p-6">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper-2 text-ink">
          <Icon size={22} aria-hidden="true" />
        </span>
        {badge && <span className="chip">{badge}</span>}
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-ink" lang="en">
        {name}
      </h3>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-ink">{what}</p>
      {text && <p className="mt-3 leading-relaxed text-ink-2">{text}</p>}
      {action && <div className="mt-auto pt-6">{action}</div>}
    </article>
  );
}

/** Lumenary Lingua's front page, in every locale: what Lingua is, its courses, its language pairs, and the rest of Lumenary Academy. */
export default async function LinguaHome({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await i18n.getT(locale);
  const all = courses.getCourses();
  const name = (tag: string) => languageName(tag, locale);
  const arrow = <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />;
  const how: [LucideIcon, string][] = [
    [Layers, t("lingua.howLevels")],
    [BookOpen, t("lingua.howLessons")],
    [Volume2, t("lingua.howListen")],
    [Unlock, t("lingua.howFree")],
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 end-[-10%] h-[36rem] w-[36rem] rounded-full bg-sky/15 blur-3xl" aria-hidden="true" />
        <div className="container-page relative py-14 sm:py-20">
          <p className="eyebrow">{t("lingua.eyebrow")}</p>
          <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl" lang="en">
            {DIVISIONS.lingua}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{t("lingua.lead")}</p>
        </div>
      </section>

      <section id="courses" className="container-page scroll-mt-20 py-14 sm:py-16" aria-labelledby="courses-title">
        <h2 id="courses-title" className="text-3xl font-semibold text-ink sm:text-4xl">
          {t("lingua.coursesTitle")}
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {all.map(({ course, path, slugs }) => {
            const first = course.levels[0]!.short;
            const last = course.levels[course.levels.length - 1]!.short;
            return (
              <li key={path}>
                <article className="card flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper-2 text-ink">
                      <Languages size={22} aria-hidden="true" />
                    </span>
                    {course.learn && <p className="eyebrow">{t("lingua.learn", { language: name(course.learn) })}</p>}
                  </div>
                  <div lang={course.locale} dir={LOCALE_META[course.locale].dir}>
                    <h3 className="mt-5 text-2xl font-semibold text-ink">{course.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-2" dangerouslySetInnerHTML={{ __html: mdInline(course.subtitle) }} />
                  </div>
                  <p className="mt-4 flex flex-wrap gap-2 text-sm">
                    <span className="chip">{t("lingua.taughtIn", { language: name(course.locale) })}</span>
                    <span className="chip">{t("lingua.levels", { from: first, to: last })}</span>
                    <span className="chip">{t("lingua.lessons", { n: slugs.length })}</span>
                  </p>
                  <nav className="mt-4 flex flex-wrap gap-1.5" aria-label={course.ui.levels} lang={course.locale}>
                    {course.levels.map((l) => (
                      <Link key={l.id} href={href(locale, `${path}#${l.id}`)} title={l.title} className="chip border-sky/40 bg-sky-soft text-sky-ink hover:border-sky">
                        {l.short}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pt-6">
                    <Link href={href(locale, path)} className="btn btn-primary">
                      {t("lingua.open")} {arrow}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-line bg-paper-2/40" aria-labelledby="how-title">
        <div className="container-page py-14 sm:py-16">
          <h2 id="how-title" className="text-3xl font-semibold text-ink sm:text-4xl">
            {t("lingua.howTitle")}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {how.map(([Icon, text]) => (
              <li key={text} className="card flex gap-4 p-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-2 text-ink">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <p className="leading-relaxed text-ink-2">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16" aria-labelledby="pairs-title">
        <h2 id="pairs-title" className="text-3xl font-semibold text-ink sm:text-4xl">
          {t("lingua.pairsTitle")}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">{t("lingua.pairsLead")}</p>
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-line text-ink-2">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("lingua.pairLearn")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("lingua.pairVia")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("lingua.pairStatus")}
                </th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map((pair) => {
                const open = pair.via.map((via) => courseFor(all, pair.learn, via)).filter((c) => c !== undefined);
                return (
                  <tr key={`${pair.learn}:${pair.via.join(",")}`} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-start font-semibold text-ink">
                      {name(pair.learn)}
                    </th>
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap gap-1.5">
                        {pair.via.map((via) => (
                          <span key={via} className="chip">
                            {name(via)}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {open.length > 0 ? (
                        open.map((c) => (
                          <Link key={c.path} href={href(locale, c.path)} className="link font-semibold">
                            {t("divisions.available")} · {t("lingua.levels", { from: c.course.levels[0]!.short, to: c.course.levels[c.course.levels.length - 1]!.short })}
                          </Link>
                        ))
                      ) : (
                        <span className="text-muted">{t("divisions.pending")}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">{t("lingua.planned")}</p>
      </section>

      <section className="border-t border-line bg-paper-2/40" aria-labelledby="academy-title">
        <div className="container-page py-14 sm:py-16">
          <p className="eyebrow">{t("divisions.eyebrow")}</p>
          <h2 id="academy-title" className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            {t("lingua.academyTitle")}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">{t("divisions.lead")}</p>
          <ul className="mt-8 grid gap-5 lg:grid-cols-3">
            <li>
              <Division
                Icon={Atom}
                accent="bg-gold"
                name={DIVISIONS.scientia}
                what={t("divisions.scientiaWhat")}
                badge={t("divisions.scientiaBadge")}
                text={t("divisions.scientiaText")}
                action={
                  <a href={SCIENTIA_URL} className="btn btn-ghost">
                    {t("divisions.scientiaCta")} {external}
                  </a>
                }
              />
            </li>
            <li>
              <Division Icon={Languages} accent="bg-sky" name={DIVISIONS.lingua} what={t("divisions.linguaWhat")} badge={t("lingua.here")} text={t("lingua.lead")} />
            </li>
            <li>
              <Division
                Icon={GraduationCap}
                accent="bg-formal"
                name={DIVISIONS.prep}
                what={t("divisions.prepWhat")}
                badge={t("divisions.prepBadge")}
                text={t("divisions.prepText")}
                action={
                  <a href={PREP_URL} className="btn btn-ghost">
                    {t("divisions.prepCta")} {external}
                  </a>
                }
              />
            </li>
          </ul>
          <p className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            <a href={academyPage(locale)} className="link font-semibold">
              {t("lingua.visitAcademy")}
            </a>
            <a href={academyPage(locale, "divisions/")} className="link font-semibold">
              {t("divisions.more")}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
