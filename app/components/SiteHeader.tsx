"use client";

import { useState } from "react";
import { t, type Locale } from "../i18n";
import LanguageSwitcher from "./LanguageSwitcher";

const links = [
  ["Projekt", "#projekt"],
  ["Texty", "#texty"],
  ["Formulář", "#formular"],
  ["Důkazy", "#dukazy"],
  ["Obrazy", "#obraz"],
  ["Autor", "#autor"],
];

export default function SiteHeader({ locale = "cs" }: { locale?: Locale }) {
  const [menu, setMenu] = useState(false);
  const pdfHref = locale === "en"
    ? "/downloads/goosebumps-project-concept-en.pdf"
    : locale === "uk"
      ? "/downloads/husyacha-shkira-kontseptsiya-uk.pdf"
      : "/downloads/husi-kuze-koncepce-cs.pdf";

  return (
    <header className="siteHeader">
      <a className="brandMark" href="#top" aria-label="Husí kůže – úvod">
        <img src="/brand/logo.svg" alt="" width="48" height="48" />
        <span>{t(locale, "HUSÍ KŮŽE")}</span>
      </a>
      <button className="menuBtn" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label={t(locale, "Otevřít navigaci")}>
        {menu ? t(locale, "Zavřít") : t(locale, "Menu")}
      </button>
      <nav className={menu ? "nav open" : "nav"} aria-label={t(locale, "Hlavní navigace")}>
        {links.map(([label, href]) => (
          <a href={href} onClick={() => setMenu(false)} key={href}>{t(locale, label)}</a>
        ))}
        <a className="navPdf" href={pdfHref} target="_blank" rel="noreferrer" onClick={() => setMenu(false)}>{t(locale, "Otevřít PDF ↗")}</a>
        <LanguageSwitcher locale={locale} label={t(locale, "Jazyk webu")} />
      </nav>
    </header>
  );
}
