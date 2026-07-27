"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "../i18n";

export default function AgeGate({ locale = "cs" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOpen(sessionStorage.getItem("hk-age") !== "yes");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function enter() {
    sessionStorage.setItem("hk-age", "yes");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="ageGate" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="ageCard">
        <img className="gateLogo" src="/brand/logo.svg" alt="" width="70" height="70" />
        <p className="eyebrow">{t(locale, "Citlivý obsah · 18+")}</p>
        <h2 id="age-title">{t(locale, "Tělo tu není zboží.")}</h2>
        <p>{t(locale, "Web mluví o intimitě a souhlasu a obsahuje malou ukázku nahého autoportrétu. Nahota ale není podmínkou účasti ani obsahem každého portrétu. Vstupem potvrzuješ, že je ti alespoň 18 let.")}</p>
        <div className="gateActions">
          <button onClick={enter} className="btn primary">{t(locale, "Je mi 18 · vstoupit")}</button>
          <a href="about:blank" className="btn ghost">{t(locale, "Odejít")}</a>
        </div>
      </div>
    </div>
  );
}
