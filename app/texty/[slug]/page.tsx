import { notFound } from "next/navigation";
import Link from "next/link";
import { essays, getEssayReadingTime } from "../data";
import ZoomableImage from "../../components/ZoomableImage";
import AgeGate from "../../components/AgeGate";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { normalizeLocale, t, withLocale } from "../../i18n";
import { getLocalizedEssay } from "../localized";

export function generateStaticParams() {
  return essays.map(({ slug }) => ({ slug }));
}

export default async function EssayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const locale = normalizeLocale((await searchParams)?.lang);
  const essay = getLocalizedEssay(slug, locale);
  if (!essay) notFound();

  return (
    <main className="essayPage">
      <AgeGate locale={locale} />
      <header className="essayNav">
        <Link href={withLocale("/", locale)} className="brandMark"><img src="/brand/logo.svg" alt="" /><span>{t(locale, "HUSÍ KŮŽE")}</span></Link>
        <div className="essayNavActions">
          <Link href={withLocale("/#texty", locale)}>{t(locale, "← Všechny texty")}</Link>
          <LanguageSwitcher locale={locale} label={t(locale, "Jazyk webu")} />
        </div>
      </header>
      <article>
        <section className="essayHero">
          <div className="essayHeroCopy">
            <p className="eyebrow">{essay.kicker}</p>
            <h1>{essay.title}</h1>
            <p className="essayDek">{essay.dek}</p>
            <div className="essayMeta"><span>{getEssayReadingTime(essay, locale)}</span><span>{essay.date}</span><span>Štěpán Chalupa</span></div>
          </div>
          <ZoomableImage
            className="essayZoomHero"
            src={essay.cover}
            alt={essay.coverAlt}
            title={essay.title}
            caption={t(locale, "Obrazová studie k autorskému textu projektu Husí kůže.")}
            eager
          />
        </section>

        <section className="essayThesis"><span>{t(locale, "Teze")}</span><p>{essay.thesis}</p></section>

        <div className="essayBody">
          {essay.sections.map((section, index) => (
            <section className="essayChapter" key={section.title}>
              <div className="chapterNo">0{index + 1}</div>
              <div>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
                {section.image && (
                  <ZoomableImage
                    className="essayInlineImage essayInlineZoom"
                    src={section.image}
                    alt={section.imageAlt || ""}
                    title={section.title}
                    caption={t(locale, "Vizuální poznámka k této kapitole autorského textu.")}
                  />
                )}
              </div>
            </section>
          ))}
        </div>

        <section className="essayBibliography">
          <div><p className="eyebrow">{t(locale, "Literatura a přímé odkazy")}</p><h2>{t(locale, "Zdroje, ze kterých text vychází.")}</h2><p>{t(locale, "Odkazy vedou na vydavatele, DOI, odborný časopis nebo profesní instituci. Pokud je celý text placený, najdeš pod odkazem alespoň ověřitelný bibliografický záznam.")}</p></div>
          <div className="bibliographyList">
            {essay.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.n}><span>{source.n}</span><div><strong>{source.title}</strong><small>{source.author}</small><p>{source.note}</p></div><b>↗</b></a>)}
          </div>
        </section>
      </article>
      <footer><Link className="brandMark footerBrand" href={withLocale("/", locale)}><img src="/brand/logo.svg" alt="" /><span>{t(locale, "HUSÍ KŮŽE")}</span></Link><p>© 2026 Štěpán Chalupa</p><Link href={withLocale("/#kontakt", locale)}>{t(locale, "Kontakt ↗")}</Link></footer>
    </main>
  );
}
