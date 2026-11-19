import "./globals.css";
import type { Metadata } from "next";
import { LOCALES, LOCALE_META } from "@lumenary/core/i18n";
import { LogoMark, Wordmark } from "@lumenary/core/brand";
import { initScript } from "@lumenary/core/site";
import { fontVariables } from "@lumenary/core/fonts";

export const metadata: Metadata = { title: "Page not found · Lumenary Lingua", robots: { index: false } };

/**
 * The 404 page for any address that matches no page (a static host serves it as 404.html). It cannot
 * know the reader's language, so it offers every locale's front page by its own name.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="min-h-screen">
        <main className="container-page flex min-h-screen flex-col items-center justify-center py-20 text-center">
          <a href="/" className="flex items-center gap-2.5 text-ink" aria-label="Lumenary Lingua">
            <LogoMark size={36} />
            <Wordmark division="Lingua" />
          </a>
          <p className="mt-10 font-display text-7xl font-semibold text-sky" aria-hidden="true">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-ink">This page doesn&apos;t exist.</h1>
          <p className="mt-3 text-ink-2">The link may be out of date, or the address may have a typo. The courses are on the front page:</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {LOCALES.map((l) => (
              <li key={l}>
                <a href={`/${l}/`} lang={l} hrefLang={l} className="btn btn-ghost">
                  {LOCALE_META[l].nativeName}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
