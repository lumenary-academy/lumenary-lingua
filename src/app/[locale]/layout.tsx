import "@lumenary/core/katex";
import "../globals.css";
import type { Metadata } from "next";
import { CORE_NAMESPACES, LOCALES, LOCALE_META, makeT, pickMessages } from "@lumenary/core/i18n";
import { I18nProvider } from "@lumenary/core/i18n/client";
import { resolveLocale } from "@lumenary/core/i18n/server";
import { DIVISIONS } from "@lumenary/core/brand";
import { fontVariables } from "@lumenary/core/fonts";
import { SiteFooter, SiteHeader, initScript, type NavItem } from "@lumenary/core/site";
import { courses, href, i18n, routingConfig } from "@/lib/site";
import { ACADEMY_URL, CODE_LICENCE_URL, CONTENT_LICENCE_URL, PREP_URL, SCIENTIA_URL, SITE_URL, SOURCE_URL } from "@/lib/links";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await i18n.getT(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: DIVISIONS.lingua, template: `%s · ${DIVISIONS.lingua}` },
    description: t("lingua.lead"),
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/`])) },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const messages = await i18n.getMessages(locale);
  const t = makeT(messages);
  const all = courses.getCourses();
  // "Courses" is the front page, which lists them; it is current on every course's pages too.
  const nav: NavItem[] = [
    { key: "courses", path: "", exact: true, also: all.map((c) => c.path) },
    { key: "about", path: "about" },
  ];
  return (
    <html lang={locale} dir={LOCALE_META[locale].dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="min-h-screen">
        <I18nProvider locale={locale} messages={pickMessages(messages, [...CORE_NAMESPACES, "lingua.notFound"])}>
          <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:start-4 focus:top-3">
            {t("nav.skip")}
          </a>
          <SiteHeader division="Lingua" siteName={DIVISIONS.lingua} nav={nav} routing={routingConfig} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter
            division="Lingua"
            mission={t("lingua.footerMission")}
            columns={[
              {
                title: DIVISIONS.lingua,
                links: [
                  ...all.map((c) => ({ label: c.course.title, href: href(locale, c.path), lang: c.course.locale })),
                  { label: t("nav.about"), href: href(locale, "about") },
                  // The front page's "From the same owner" section: the footer's one pointer to the owner's other projects.
                  { label: t("lingua.sameOwner.footer"), href: href(locale, "#same-owner") },
                ],
              },
              {
                title: DIVISIONS.academy,
                links: [
                  { label: DIVISIONS.academy, href: ACADEMY_URL },
                  { label: DIVISIONS.scientia, href: SCIENTIA_URL },
                  { label: DIVISIONS.prep, href: PREP_URL },
                ],
              },
              {
                title: t("footer.openSource"),
                links: [
                  { label: t("footer.sourceCode"), href: SOURCE_URL },
                  { label: t("footer.codeLicence"), href: CODE_LICENCE_URL },
                  { label: t("footer.contentLicence"), href: CONTENT_LICENCE_URL },
                ],
              },
            ]}
            license={t("footer.license")}
            note={t("footer.noEndorsement")}
          />
        </I18nProvider>
      </body>
    </html>
  );
}
