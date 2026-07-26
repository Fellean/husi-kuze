"use client";

import { useEffect, useState } from "react";
import { essays } from "./texty/data";

const steps = [
  { n: "01", title: "Setkání", text: "Bez kamery, bez závazku. Vzájemné poznání, očekávání a důvod, proč do portrétu vstoupit." },
  { n: "02", title: "Návrh", text: "Společně skládáme obraz, hlas, místo, dotek, anonymitu a míru spoluautorství." },
  { n: "03", title: "Natáčení", text: "Citlivý rámec, improvizace, průběžná domluva a možnost kdykoli zastavit." },
  { n: "04", title: "Střih", text: "Společné rozhodnutí o výsledku a o každém konkrétním použití." },
];

const spectrum = [
  { label: "Přítomnost", sub: "dech · blízkost · ticho", text: "Dvě těla mohou jen ležet vedle sebe a dýchat. Intimita nemusí začínat nahotou ani sexem." },
  { label: "Péče", sub: "hlazení · vlasy · masáž", text: "Dlaň na zádech, česání vlasů, teplo dechu nebo opora. Kamera sleduje drobné fyzické reakce." },
  { label: "Otevřenost", sub: "nahota · váha · intimní dotek", text: "Otevřenější poloha je možnost, ne povinná eskalace. Rozsah vzniká jedině ze společné dohody." },
  { label: "Za hranou zvyku", sub: "slast · vzrušení · vyvrcholení", text: "I explicitnější zkušenost může zůstat součástí konkrétního člověka, jeho hlasu a svobodného rozhodnutí." },
];

const safety = [
  ["Před kamerou", "Konkrétně a bez eufemismů pojmenujeme obraz, dotek, nahotu, anonymitu, zvuk i zamýšlené použití. Stejně důležité je říct, co v portrétu nebude."],
  ["Na místě", "Počet lidí a podoba uzavřeného prostoru se řídí potřebami účastníků. Kdo chce, přivede si důvěryhodnou osobu. Pracuje se střízlivě a s domluveným stop slovem či gestem."],
  ["Při novém nápadu", "Improvizace je vítaná, ale neprobíhá potichu. Zastavíme obraz, návrh vyslovíme a každý dostane čas rozhodnout se bez tlaku."],
  ["Před uvedením", "Účastníci vidí pracovní i finální střih. Samostatně schvalují konkrétní verzi i okruh použití: portfolio, web, sociální síť, projekci, výstavu nebo festival."],
];

const atlas = [
  { title: "Carolee Schneemann · Fuses", year: "1964–1967", img: "/media/hkimg-013.jpg", text: "Tělo není hladký objekt; stává se materiálem filmu, časem i strukturou.", url: "https://www.eai.org/titles/fuses" },
  { title: "Barbara Hammer · Dyketactics", year: "1974", img: "/media/hkimg-014.jpg", text: "Montáž těl, přírody a queer blízkosti skládá dotykovou paměť barev a povrchu.", url: "https://www.eai.org/titles/dyketactics" },
  { title: "Pipilotti Rist · Pickelporno", year: "1992", img: "/media/hkimg-015.jpg", text: "Extrémní detaily těla se prolínají s přírodou a psychedelickou barvou.", url: "https://www.sammlung-goetz.de/en/exhibitions/pipilotti-rist/" },
  { title: "Barbara Hammer · Sync Touch", year: "1981", img: "/media/hkimg-016.jpg", text: "Neukazovat hmat, ale nechat obraz hmatově myslet.", url: "https://www.eai.org/titles/sync-touch" },
  { title: "Clio Barnard · The Arbor", year: "2010", img: "/media/hkimg-017.jpg", text: "Autentický hlas zůstává, zatímco tvář patří někomu jinému.", url: "https://www.bfi.org.uk/film/255658f7-981a-55e9-a075-67e559a26191/the-arbor" },
  { title: "Marina Abramović · Rhythm 0", year: "1974", img: "/media/hkimg-020.jpg", text: "Důležitý kontrast: účastník nesmí přestat být jednajícím spoluautorem.", url: "https://www.moma.org/audio/playlist/243/3118" },
];

const sourceKinds = ["vše", "dotek", "společnost", "film", "bezpečí"];

const visualEssay = [
  { src: "/gallery/puda-mravenci.png", alt: "Mravenci na půdě obklopují organický útvar", label: "PŮDA / SPOLEČENSTVÍ" },
  { src: "/gallery/lebka-karty.png", alt: "Stylizovaná lebka v košili obklopená hracími kartami", label: "ROLE / SMRTELNOST" },
  { src: "/gallery/drevo-telo.webp", alt: "Detail dřeva připomínajícího lidské tělo", label: "POVRCH / TĚLO" },
  { src: "/gallery/organicky-povrch.webp", alt: "Mokrý organický povrch v extrémním detailu", label: "DOTYK / HMOTA" },
  { src: "/gallery/sklenene-oko-extreme.png", alt: "Kruhový abstraktní pohled skrze sklo", label: "POHLED / LOM" },
  { src: "/gallery/temny-lustr-extreme.png", alt: "Temný lustr překrytý organickou strukturou", label: "PAMĚŤ / INTERIÉR" },
  { src: "/gallery/zimni-les.webp", alt: "Zimní les proti nízkému slunci", label: "CHLAD / REAKCE" },
  { src: "/gallery/jablka-snih.webp", alt: "Dvě žlutá jablka na zasněžených větvích", label: "KŘEHKOST / VÝDRŽ" },
  { src: "/gallery/cerveny-signal.png", alt: "Rozpadlý červený digitální obraz", label: "SIGNÁL / SELHÁNÍ" },
  { src: "/gallery/kresba-vrstvy.webp", alt: "Kreslená tvář postupně překrývaná další vrstvou", label: "AUTOPORTRÉT / MAZÁNÍ" },
  { src: "/gallery/zelena-lebka.png", alt: "Zeleně nasvícená lebka se špendlíky", label: "SMYSL / PŘETÍŽENÍ" },
  { src: "/gallery/hreben-makro.png", alt: "Extrémní makro pravidelných kovových zubů", label: "ŘÁD / TŘENÍ" },
];

const sources = [
  {
    kind: "dotek",
    type: "studie · open access",
    title: "Social touch deprivation during COVID-19",
    author: "Mariana von Mohr a kol. · Royal Society Open Science · 2021",
    text: "Výzkum vztahu mezi nedostatkem chtěného sociálního doteku, psychickou pohodou a touhou po mezilidském kontaktu.",
    url: "https://royalsocietypublishing.org/rsos/article/8/9/210287/96157/Social-touch-deprivation-during-COVID-19-effects",
  },
  {
    kind: "dotek",
    type: "systematický přehled · meta-analýza",
    title: "A systematic review and multivariate meta-analysis of the physical and mental health benefits of touch interventions",
    author: "Packheiser a kol. · Nature Human Behaviour · 2024",
    text: "Souhrn 137 studií zkoumajících, kdy a za jakých podmínek dotekové intervence souvisejí s fyzickým a duševním zdravím.",
    url: "https://pubmed.ncbi.nlm.nih.gov/38589702/",
  },
  {
    kind: "dotek",
    type: "odborný přehled",
    title: "Affectionate Touch to Promote Relational, Psychological, and Physical Well-Being in Adulthood",
    author: "Jakubiak & Feeney · Personality and Social Psychology Review · 2017",
    text: "Teoretický model popisující možné cesty od láskyplného doteku přes regulaci stresu k pocitu bezpečí a vztahové pohodě.",
    url: "https://pubmed.ncbi.nlm.nih.gov/27225036/",
  },
  {
    kind: "společnost",
    type: "kniha · sociologie",
    title: "Cold Intimacies: The Making of Emotional Capitalism",
    author: "Eva Illouz · Polity · 2007",
    text: "Jak ekonomický jazyk, terapie a kultura výkonu vstupují do emocí, vztahů a způsobů, jimiž vyprávíme sami sebe.",
    url: "https://www.politybooks.com/bookdetail?book_slug=cold-intimacies-the-making-of-emotional-capitalism--9780745639048",
  },
  {
    kind: "společnost",
    type: "kniha · mediální studia",
    title: "If…Then: Algorithmic Power and Politics",
    author: "Taina Bucher · Oxford University Press · 2018",
    text: "Výzkum toho, jak algoritmy nefungují jen jako neutrální nástroje, ale spoluvytvářejí naše jednání, viditelnost a orientaci ve světě.",
    url: "https://global.oup.com/academic/product/ifthen-9780190493035",
  },
  {
    kind: "společnost",
    type: "esej · feministická teorie",
    title: "Uses of the Erotic: The Erotic as Power",
    author: "Audre Lorde · 1978",
    text: "Erotično jako schopnost plně cítit vlastní zkušenost, poznat hluboké uspokojení a odmítnout život podle cizího scénáře.",
    url: "https://uk.sagepub.com/sites/default/files/upm-binaries/11881_Chapter_5.pdf",
  },
  {
    kind: "film",
    type: "kniha · filmová teorie",
    title: "The Skin of the Film",
    author: "Laura U. Marks · Duke University Press · 2000",
    text: "Klíčový text o haptické vizualitě: obrazu, který nezůstává vzdáleným pohledem, ale probouzí tělesnou a smyslovou paměť.",
    url: "https://www.dukeupress.edu/The-Skin-of-the-Film",
  },
  {
    kind: "film",
    type: "film · institucionální kontext",
    title: "The Arbor",
    author: "Clio Barnard · British Film Institute · 2010",
    text: "Dokument pracující s autentickými nahrávkami Andrey Dunbar a jejích blízkých, které před kamerou synchronizují jiní performeři.",
    url: "https://www.bfi.org.uk/film/255658f7-981a-55e9-a075-67e559a26191/the-arbor",
  },
  {
    kind: "bezpečí",
    type: "profesní standard · film",
    title: "Standards and Protocols for the Use of Intimacy Coordinators",
    author: "SAG-AFTRA · aktualizace 2024",
    text: "Průmyslový rámec pro informovaný a průběžný souhlas, popsaný rozsah scény, uzavřený set a bezpečné změny choreografie.",
    url: "https://www.sagaftra.org/sites/default/files/sa_documents/SA_IntimacyCoord.pdf",
  },
  {
    kind: "bezpečí",
    type: "profesní metodika · film",
    title: "Guidance for Shooting Intimacy",
    author: "Bectu · Equity · 2022",
    text: "Praktická metodika práce s nahotou, simulovaným sexem, hranicemi, skromnostními pomůckami a duševní pohodou štábu.",
    url: "https://www.equity.org.uk/media/3u5pez2c/bectu-guidance-for-shooting-intimacy-october-2022.pdf",
  },
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [activeTouch, setActiveTouch] = useState(0);
  const [activeLayer, setActiveLayer] = useState("obraz");
  const [openSafety, setOpenSafety] = useState(0);
  const [sourceFilter, setSourceFilter] = useState("vše");
  const [age, setAge] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("hk-age");
    setAge(!seen);
  }, []);

  function enter() {
    sessionStorage.setItem("hk-age", "yes");
    setAge(false);
  }

  return (
    <main>
      {age && <div className="ageGate" role="dialog" aria-modal="true" aria-labelledby="age-title">
        <div className="ageCard">
          <img className="gateLogo" src="/brand/logo.svg" alt="" />
          <p className="eyebrow">Citlivý obsah · 18+</p>
          <h2 id="age-title">Tělo tu není zboží.</h2>
          <p>Projekt otevřeně pracuje s intimitou, nahotou a souhlasem. Vstupem potvrzuješ, že je ti alespoň 18 let.</p>
          <div className="gateActions"><button onClick={enter} className="btn primary">Je mi 18 · vstoupit</button><a href="about:blank" className="btn ghost">Odejít</a></div>
        </div>
      </div>}

      <header className="siteHeader">
        <a className="brandMark" href="#top" aria-label="Husí kůže – úvod"><img src="/brand/logo.svg" alt="" /><span>HUSÍ KŮŽE</span></a>
        <button className="menuBtn" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Otevřít navigaci">{menu ? "Zavřít" : "Menu"}</button>
        <nav className={menu ? "nav open" : "nav"}>
          <a href="#projekt" onClick={() => setMenu(false)}>Projekt</a><a href="#proces" onClick={() => setMenu(false)}>Proces</a><a href="#bezpeci" onClick={() => setMenu(false)}>Bezpečí</a><a href="#texty" onClick={() => setMenu(false)}>Texty</a><a href="#zdroje" onClick={() => setMenu(false)}>Zdroje</a><a href="#autor" onClick={() => setMenu(false)}>Autor</a>
          <a className="navCta" href="#podpora" onClick={() => setMenu(false)}>Podpořit projekt ↘</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Filmové portréty doteku · pracovní koncepce</p>
          <h1 className="srOnly">Husí kůže</h1>
          <img className="heroLogotype" src="/brand/logotyp.svg" alt="Footage: Husí kůže" />
          <p className="heroLead">Série krátkých filmových portrétů o těle, blízkosti a odvaze nechat se opravdu vidět.</p>
          <div className="heroActions"><a className="btn primary" href="#projekt">Prozkoumat projekt ↓</a><a className="btn ghost" href="/FOOTAGE_HUSI_KUZE_v4.5.pdf" download>Stáhnout PDF ↗</a></div>
        </div>
        <div className="heroImage"><img src="/gallery/organicka-propast.webp" alt="Organický povrch připomínající kůži a krajinu"/><div className="acidDisc">ODVAHA K<br/>ZRANITELNOSTI</div><span className="verticalTag">HUSÍ KŮŽI NEZAHRAJEŠ</span></div>
      </section>

      <section id="projekt" className="section cream intro">
        <div className="sectionNo">01 · O CO JDE</div>
        <div className="introGrid"><div><h2>Portrét, který začíná na povrchu</h2><p className="bigText">Nejde o přehlídku těl. Jde o mapu toho, co s tělem dělá důvěra.</p></div><div className="bodyCopy"><p>Každý portrét patří jednomu člověku nebo lidem, kteří chtějí vstoupit do obrazu spolu. Tvář ani jméno nejsou podmínkou. Kamera jde tak blízko, že zůstává kůže, chloupky, dlaň, otisk, dech, látka, světlo a drobná změna napětí.</p><p>Druhou polovinu filmu tvoří hlas. Nemusí vysvětlovat obraz. Může nést jinou chvíli života, zatímco tělo vytváří druhý způsob portrétování.</p></div></div>
        <blockquote>„Husí kůži nezahraješ. Kamera hledá reakce, které vznikají dřív než póza.“</blockquote>
      </section>

      <section className="imageCurrent" aria-label="Obrazový proud projektu">
        {visualEssay.slice(0,4).map((image, index) => <figure className={`currentImage currentImage${index + 1}`} key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>{String(index + 1).padStart(2,"0")} · {image.label}</figcaption></figure>)}
      </section>

      <section className="section navy problem">
        <div className="sectionNo">02 · PROČ</div><h2>Co nám vzali?</h2><p className="lede">Těla nikdy nebyla viditelnější. O to snáz se ale mohou vzdálit lidem, kteří v nich skutečně žijí.</p>
        <div className="problemGrid"><div className="problemCopy"><p>Současná vizuální kultura ukazuje těla téměř nepřetržitě, ale většinou jako objekty hodnocení, žádoucnosti, výkonu nebo spotřeby. Projekt se ptá, zda lze intimitu filmovat tak, aby člověk před kamerou neztratil kontrolu nad významem svého těla.</p><p>Pečující dotek přitom není jen dekorace vztahu. Výzkum ho spojuje s regulací stresu, pocitem bezpečí a psychickou pohodou — vždy ale záleží na tom, zda je chtěný, vzájemný a zasazený do konkrétního vztahu.</p><div className="inlineSources"><a href="https://royalsocietypublishing.org/rsos/article/8/9/210287/96157/Social-touch-deprivation-during-COVID-19-effects" target="_blank" rel="noreferrer">studie o nedostatku doteku ↗</a><a href="https://pubmed.ncbi.nlm.nih.gov/38589702/" target="_blank" rel="noreferrer">meta-analýza 137 studií ↗</a></div></div><div className="tiles"><div>TĚLO<small>projekt bez konce</small></div><div>PROFIL<small>nabídka k posouzení</small></div><div>POZORNOST<small>dosah, reakce, skóre</small></div><div>BLÍZKOST<small>výkon s očekávaným výsledkem</small></div></div></div>
      </section>

      <section id="proces" className="section cream process">
        <div className="sectionNo">03 · JAK PORTRÉT VZNIKÁ</div><h2>Nejdřív člověk.<br/>Teprve potom obraz.</h2><p className="lede dark">První setkání proběhne bez kamery a bez nutnosti cokoli slíbit. Teprve z něj vznikne návrh portrétu.</p>
        <div className="steps">{steps.map((s,i)=><button key={s.n} className="step" onClick={()=>document.getElementById(`step-${i}`)?.classList.toggle("show")} aria-controls={`step-${i}`}><span>{s.n}</span><strong>{s.title}</strong><p id={`step-${i}`}>{s.text}</p><i>+</i></button>)}</div>
      </section>

      <section className="section spectrum">
        <div className="sectionNo">04 · ROZSAH</div><h2>Co se může dít</h2>
        <div className="spectrumTabs" role="tablist">{spectrum.map((s,i)=><button role="tab" aria-selected={activeTouch===i} className={activeTouch===i?"active":""} key={s.label} onClick={()=>setActiveTouch(i)}><span>{s.label}</span><small>{s.sub}</small></button>)}</div>
        <div className="spectrumDetail"><span>0{activeTouch+1}</span><p>{spectrum[activeTouch].text}</p></div><p className="manifest">Portrét není méně úplný, když zůstane u prvního doteku. Je úplný tehdy, když odpovídá člověku, který v něm je.</p>
      </section>

      <section className="section black layers">
        <div className="sectionNo">05 · OBRAZ, HLAS, ZVUK</div><h2>Tak blízko, až se tělo stane krajinou</h2>
        <div className="layerTabs">{["obraz","hlas","zvuk"].map(x=><button className={activeLayer===x?"active":""} onClick={()=>setActiveLayer(x)} key={x}>{x}</button>)}</div>
        <div className="layerContent">
          {activeLayer==="obraz" && <><img src="/gallery/zlata-mriz.webp" alt="Zlatý povrch rozdělený organickou mříží"/><div><h3>Detail, ne anatomická mapa</h3><p>Výsek kůže může vyplnit obraz stejně jako stěna, kůra stromu nebo krajina. Styl není jednotný filtr; každý portrét si hledá vlastní způsob vidění.</p><a className="layerLink" href="https://www.dukeupress.edu/The-Skin-of-the-Film" target="_blank" rel="noreferrer">Laura U. Marks · haptická vizualita ↗</a></div></>}
          {activeLayer==="hlas" && <><img src="/gallery/kresba-tvare.webp" alt="Bílá kresba tváře v černém prostoru"/><div><h3>Rozhovor nemusí nic ilustrovat</h3><p>Hlas může mluvit o rodině, samotě, práci nebo místě, kde se člověk cítí doma. Mezi slovem a obrazem vzniká třetí význam.</p></div></>}
          {activeLayer==="zvuk" && <><img src="/gallery/temny-lustr.webp" alt="Temný lustr překrytý organickou strukturou"/><div><h3>Poslouchat povrch</h3><p>Dlaň přejíždějící po kůži, polknutí, změna dechu, krok naboso, vrzání matrace. Ticho tu není prázdno.</p></div></>}
        </div>
      </section>

      <section className="imageCurrent imageCurrentDark" aria-label="Druhá část obrazového proudu projektu">
        {visualEssay.slice(4).map((image, index) => <figure className={`currentImage currentImage${index + 1}`} key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>{String(index + 5).padStart(2,"0")} · {image.label}</figcaption></figure>)}
      </section>

      <section id="bezpeci" className="section cream safety">
        <div className="sectionNo">06 · BEZPEČÍ</div><h2>Souhlas není podpis.<br/>Je to způsob práce.</h2>
        <div className="safetyGrid">{safety.map((s,i)=><div className={openSafety===i?"safetyItem open":"safetyItem"} key={s[0]}><button onClick={()=>setOpenSafety(openSafety===i?-1:i)} aria-expanded={openSafety===i}><span>0{i+1}</span>{s[0]}<i>{openSafety===i?"−":"+"}</i></button><p>{s[1]}</p></div>)}</div>
        <div className="safetyQuote">Dotek i natáčení lze kdykoli zastavit, zpomalit, změnit nebo úplně vynechat. Bez nutnosti obhajovat důvod.</div>
        <div className="methodNote"><span>METODICKÉ ZÁZEMÍ</span><p>Rámec vychází z principů profesionální koordinace intimních scén. Nejde o tvrzení, že malý autorský projekt nahrazuje vyškolenou koordinátorku či koordinátora — právě naopak. Standardy používám jako minimum pro přípravu a externí konzultaci.</p><div><a href="https://www.sagaftra.org/sites/default/files/sa_documents/SA_IntimacyCoord.pdf" target="_blank" rel="noreferrer">SAG-AFTRA · standardy ↗</a><a href="https://www.equity.org.uk/media/3u5pez2c/bectu-guidance-for-shooting-intimacy-october-2022.pdf" target="_blank" rel="noreferrer">Bectu / Equity · metodika ↗</a></div></div>
      </section>

      <section className="section navy atlas">
        <div className="sectionNo">07 · VIZUÁLNÍ A METODICKÝ ATLAS</div><h2>Obrazy, které otevírají cestu</h2><p className="lede">Klikni na kartu a otevři původní dílo nebo institucionální zdroj.</p>
        <div className="atlasGrid">{atlas.map(a=><a href={a.url} target="_blank" rel="noreferrer" className="atlasCard" key={a.title}><div className="atlasImg"><img src={a.img} alt=""/><span>↗</span></div><small>{a.year}</small><h3>{a.title}</h3><p>{a.text}</p></a>)}</div>
      </section>

      <section id="texty" className="section essays">
        <div className="essayIndexHead"><div><div className="sectionNo">08 · MAKROSTUDIE</div><h2>Texty pod povrchem</h2></div><div><p className="lede dark">Delší autorské studie propojují filmovou teorii, sociologii, psychologický výzkum a praktickou etiku natáčení.</p><p>Nejsou to akademické články předstírající recenzní řízení. Jsou to argumentované eseje s dohledatelnými zdroji, otevřenými limity a prostorem pro nesouhlas.</p></div></div>
        <div className="essayCards">
          {essays.map((essay, index) => <a className="essayCard" href={`/texty/${essay.slug}`} key={essay.slug}>
            <figure><img src={essay.cover} alt={essay.coverAlt}/><span>0{index + 1}</span></figure>
            <div><small>{essay.kicker}</small><h3>{essay.title}</h3><p>{essay.dek}</p><b>{essay.read} · otevřít text ↗</b></div>
          </a>)}
        </div>
      </section>

      <section id="zdroje" className="section sources">
        <div className="sourceHead"><div><div className="sectionNo">09 · STUDIE A TEXTY</div><h2>Čti dál.<br/>Nebo mi odporuj.</h2></div><p>Projekt nestojí na jednom univerzálním návodu k intimitě. Tohle je otevřená knihovna textů, které formují jeho otázky, obrazový jazyk a bezpečnostní rámec. Odkazy vedou na původní studie, vydavatele nebo profesní instituce.</p></div>
        <div className="sourceFilters" aria-label="Filtrovat zdroje">{sourceKinds.map(kind=><button key={kind} className={sourceFilter===kind?"active":""} onClick={()=>setSourceFilter(kind)} aria-pressed={sourceFilter===kind}>{kind}</button>)}</div>
        <div className="sourceGrid" aria-live="polite">{sources.filter(source=>sourceFilter==="vše"||source.kind===sourceFilter).map((source,index)=><a className="sourceCard" href={source.url} target="_blank" rel="noreferrer" key={source.title}><div className="sourceTop"><span>{source.type}</span><b>↗</b></div><small>{String(index+1).padStart(2,"0")} · {source.kind}</small><h3>{source.title}</h3><p className="sourceAuthor">{source.author}</p><p>{source.text}</p></a>)}</div>
        <p className="sourceDisclaimer">Výzkum doteku popisuje průměrné souvislosti a intervence, ne automatický účinek každého kontaktu. Chtěný dotek může být podpůrný; nechtěný dotek je překročení hranice. Kontext není drobným písmem pod čarou — je to celá věta.</p>
      </section>

      <section id="autor" className="section black author">
        <div className="authorImage"><img src="/gallery/prudky-potok-explicitni.png" alt="Štěpán Chalupa stojí nahý v horském potoce"/><span>AUTOPORTRÉT · PRUDKÝ POTOK</span></div><div><div className="sectionNo">10 · AUTOR</div><h2>Kdo to točí</h2><p className="lede">Jmenuju se Štěpán Chalupa. Vystudoval jsem filmovou vědu na Masarykově univerzitě, režíroval vzdělávací formát What The Fact? pro Českou televizi a tvořím videoeseje, fotografie a cestovní deníky.</p><p>Jsem neurodivergentní a senzoricky citlivý. Právě proto mě zajímá, co se stane, když obranu nepovažujeme za konečnou identitu. Nechci stát za kamerou v bezpečí a po druhých žádat zranitelnost — do obrazu proto vstupuju i vlastním tělem.</p><p>První portréty vznikají také pro přijímačkové portfolio na dokumentární, filmové a multimediální školy. Projekt je ale plánovaný jako dlouhodobá série, ne jako jednorázové cvičení, které po přijímačkách usne v šuplíku.</p></div>
      </section>

      <section id="podpora" className="section support">
        <div className="supportCopy">
          <div className="sectionNo">11 · NEZÁVISLÁ PODPORA</div>
          <h2>Zatím bez instituce.<br/>Ne bez práce.</h2>
          <p className="supportLead">Husí kůže zatím vzniká nezávisle, z vlastního času a prostředků. Nemá za sebou produkci, grant ani značku, která by si za podporu koupila kus významu.</p>
          <p>Podpora pomáhá zaplatit techniku, cestu, prostor, postprodukci a hlavně čas potřebný k citlivé přípravě portrétů. Vedle filmů díky ní mohou vznikat i volně přístupné autorské články, makrostudie, průběžné poznámky a úvahy, které propojují film, tělo, společnost a etiku práce se zdroji.</p>
          <p>Částka není vstupenka k obsahu ani hlas navíc při rozhodování o projektu. Je to prostě možnost pomoct, aby mohl růst pomaleji, poctivěji a bez potřeby převlékat intimitu za reklamní plochu.</p>
          <div className="supportLinks">
            <a className="btn darkBtn" href="/podpora/qr-platba.png" target="_blank">Otevřít QR platbu ↗</a>
            <a className="supportTextLink" href="#texty">Přečíst autorské texty ↓</a>
          </div>
        </div>
        <a className="qrCard" href="/podpora/qr-platba.png" target="_blank" aria-label="Otevřít QR kód pro podporu projektu v plné velikosti">
          <span>JEDNORÁZOVÁ PODPORA</span>
          <img src="/podpora/qr-platba.png" alt="QR kód pro platbu na podporu projektu Husí kůže" />
          <strong>Naskenuj v bankovní aplikaci</strong>
          <small>Kliknutím otevřeš QR v plné velikosti.</small>
        </a>
      </section>

      <section className="manifestSection"><p>ZAŤATÁ PĚST<br/>NEOBEJME.<br/><em>UVOLNI JI.</em></p><div className="scribble"></div><span>ODVAHA K ZRANITELNOSTI</span></section>

      <section id="kontakt" className="section contact"><p className="eyebrow">Projekt je v přípravě · Praha · 2026</p><h2>Chceš se zeptat,<br/>přidat nebo jen nesouhlasit?</h2><p>První schůzka je vždy bez kamery a bez závazku. Můžeš se ozvat kvůli účasti, konzultaci, spolupráci nebo obyčejné otázce.</p><div className="contactActions"><a className="btn darkBtn" href="mailto:stepanchalupa@post.cz?subject=Husí kůže">Napsat e-mail ↗</a><a className="btn ghostDark" href="tel:+420728568913">+420 728 568 913</a></div></section>
      <footer><a className="brandMark footerBrand" href="#top"><img src="/brand/logo.svg" alt="" /><span>HUSÍ KŮŽE</span></a><p>© 2026 Štěpán Chalupa · pracovní koncepce</p><a href="/FOOTAGE_HUSI_KUZE_v4.5.pdf" download>PDF ke stažení ↓</a></footer>
    </main>
  );
}
