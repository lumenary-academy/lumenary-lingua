"use client";

import Link from "next/link";
import { useI18n } from "@lumenary/core/i18n/client";

/** The not-found message in the reader's language (the layout provides `lingua.notFound`). */
export function NotFoundMessage() {
  const { locale, t } = useI18n();
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-semibold text-sky" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-ink">{t("lingua.notFound.title")}</h1>
      <p className="mt-3 text-ink-2">{t("lingua.notFound.text")}</p>
      <Link href={`/${locale}/`} className="btn btn-primary mt-8">
        {t("lingua.notFound.home")}
      </Link>
    </div>
  );
}
