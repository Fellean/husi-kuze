"use client";

import { useEffect } from "react";
import { localeNames, type Locale } from "../i18n";

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const savedLocale = localStorage.getItem("hk-language");

    if (
      !url.searchParams.has("lang") &&
      (savedLocale === "en" || savedLocale === "uk")
    ) {
      url.searchParams.set("lang", savedLocale);
      window.location.replace(url.toString());
      return;
    }

    document.documentElement.lang = locale;
    localStorage.setItem("hk-language", locale);
  }, [locale]);

  function changeLanguage(next: Locale) {
    const url = new URL(window.location.href);
    localStorage.setItem("hk-language", next);
    if (next === "cs") url.searchParams.delete("lang");
    else url.searchParams.set("lang", next);
    window.location.assign(url.toString());
  }

  return (
    <div className="languageSwitcher" role="group" aria-label={label}>
      {(["cs", "en", "uk"] as Locale[]).map((item) => (
        <button
          type="button"
          className={item === locale ? "active" : ""}
          aria-pressed={item === locale}
          onClick={() => changeLanguage(item)}
          title={localeNames[item]}
          key={item}
        >
          {item === "uk" ? "UA" : item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
