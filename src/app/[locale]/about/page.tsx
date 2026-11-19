import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@lumenary/core/i18n/server";
import { DIVISIONS } from "@lumenary/core/brand";
import { PageHeader } from "@lumenary/core/ui";
import { i18n } from "@/lib/site";
import { SOURCE_URL, academyPage } from "@/lib/links";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await i18n.getT(await resolveLocale(params));
  return { title: t("lingua.about.title"), description: t("lingua.about.lead") };
}

/** About Lumenary Lingua, briefly; Lumenary Academy's own about page covers the whole academy. */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await i18n.getT(locale);
  const external = <ArrowUpRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />;
  return (
    <>
      <PageHeader eyebrow={DIVISIONS.lingua} title={t("lingua.about.title")} lead={t("lingua.about.lead")} />
      <div className="container-page py-12">
        <div className="prose-ui mx-auto max-w-3xl">
          {(["what", "free", "review", "reflection"] as const).map((k) => (
            <p key={k}>{t(`lingua.about.${k}`)}</p>
          ))}
        </div>
        <p className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-3">
          <a href={academyPage(locale, "about/")} className="btn btn-primary">
            {t("lingua.about.academy")} {external}
          </a>
          <a href={SOURCE_URL} className="btn btn-ghost">
            {t("lingua.about.source")} {external}
          </a>
        </p>
      </div>
    </>
  );
}
