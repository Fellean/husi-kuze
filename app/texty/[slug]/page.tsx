import { notFound } from "next/navigation";
import { essays, getEssay } from "../data";

export function generateStaticParams() {
  return essays.map(({ slug }) => ({ slug }));
}

export default async function EssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  return (
    <main className="essayPage">
      <header className="essayNav">
        <a href="/" className="brandMark"><img src="/brand/logo.svg" alt="" /><span>HUSÍ KŮŽE</span></a>
        <a href="/#texty">← Všechny makrostudie</a>
      </header>
      <article>
        <section className="essayHero">
          <div className="essayHeroCopy">
            <p className="eyebrow">{essay.kicker}</p>
            <h1>{essay.title}</h1>
            <p className="essayDek">{essay.dek}</p>
            <div className="essayMeta"><span>{essay.read}</span><span>{essay.date}</span><span>Štěpán Chalupa</span></div>
          </div>
          <figure><img src={essay.cover} alt={essay.coverAlt}/><figcaption>Obrazová studie projektu Husí kůže</figcaption></figure>
        </section>

        <section className="essayThesis"><span>Teze</span><p>{essay.thesis}</p></section>

        <div className="essayBody">
          {essay.sections.map((section, index) => (
            <section className="essayChapter" key={section.title}>
              <div className="chapterNo">0{index + 1}</div>
              <div>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
                {section.image && <figure className="essayInlineImage"><img src={section.image} alt={section.imageAlt || ""}/><figcaption>Vizuální poznámka · Husí kůže</figcaption></figure>}
              </div>
            </section>
          ))}
        </div>

        <section className="essayBibliography">
          <div><p className="eyebrow">Literatura a přímé odkazy</p><h2>Číst proti textu je povoleno.</h2><p>Zdroje vedou přímo na vydavatele, DOI, odborný časopis nebo profesní instituci. Kde je text placený, odkaz vede alespoň na ověřitelný bibliografický záznam.</p></div>
          <div className="bibliographyList">
            {essay.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.n}><span>{source.n}</span><div><strong>{source.title}</strong><small>{source.author}</small><p>{source.note}</p></div><b>↗</b></a>)}
          </div>
        </section>
      </article>
      <footer><a className="brandMark footerBrand" href="/"><img src="/brand/logo.svg" alt="" /><span>HUSÍ KŮŽE</span></a><p>© 2026 Štěpán Chalupa</p><a href="/#kontakt">Kontakt ↗</a></footer>
    </main>
  );
}
