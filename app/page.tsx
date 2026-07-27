import { getEssayReadingTime } from "./texty/data";
import AgeGate from "./components/AgeGate";
import SiteHeader from "./components/SiteHeader";
import ZoomableImage from "./components/ZoomableImage";
import ProjectForm from "./components/ProjectForm";
import siteContent from "./content/site-content.json";
import { localizeDeep, normalizeLocale, t, withLocale } from "./i18n";
import { getLocalizedEssays } from "./texty/localized";

const decisionImages = [
  "/gallery/drevo-telo.webp",
  "/gallery/umlcena-tvar.webp",
  "/gallery/sklenene-oko.webp",
  "/gallery/levitujici-list.webp",
  "/gallery/cerveny-signal-optimized.webp",
  "/gallery/zimni-les.webp",
];

const researchLinks = [
  {
    title: "Social touch deprivation during COVID-19",
    meta: "Royal Society Open Science · 2021",
    url: "https://royalsocietypublishing.org/rsos/article/8/9/210287/96157/Social-touch-deprivation-during-COVID-19-effects",
    takeaway: "Nedostatek chtěného intimního doteku souvisel v pandemickém období s osamělostí a úzkostí. Souvislost není příkazem dotýkat se kohokoli.",
  },
  {
    title: "Health benefits of touch interventions",
    meta: "Nature Human Behaviour · 2024 · meta-analýza 137 studií",
    url: "https://www.nature.com/articles/s41562-024-01841-8",
    takeaway: "Souhrn 137 studií popsal malé až střední přínosy některých dotekových intervencí. Zahrnuté situace se ale výrazně lišily.",
  },
  {
    title: "Topography of social touching",
    meta: "PNAS · 2015 · vztah a přijatelnost doteku",
    url: "https://www.pnas.org/doi/10.1073/pnas.1519231112",
    takeaway: "Místa, kterých se smí druzí dotýkat, se mění podle emočního vztahu. Tělo tedy nečte dotek odděleně od sociálního kontextu.",
  },
  {
    title: "Love and affectionate touch in 37 countries",
    meta: "Scientific Reports · 2023 · 7 880 účastníků",
    url: "https://www.nature.com/articles/s41598-023-31502-1",
    takeaway: "Napříč 37 zeměmi souvisela hlášená partnerská láska s něžným dotekem, zároveň však studie zachytila kulturní i individuální rozdíly.",
  },
  {
    title: "The Skin of the Film",
    meta: "Laura U. Marks · haptická vizualita",
    url: "https://www.dukeupress.edu/The-Skin-of-the-Film",
    takeaway: "Teoretické zázemí obrazu, v němž oko neidentifikuje tělo na první dobrou, ale vnímá povrch, zrno, měřítko a vlastní tělesnou paměť.",
  },
  {
    title: "Techniques of the Body",
    meta: "Marcel Mauss · Economy and Society",
    url: "https://www.tandfonline.com/doi/abs/10.1080/03085147300000003",
    takeaway: "I zdánlivě přirozené zacházení s tělem se učíme ve společnosti. Stud, gesto a způsob kontaktu nejsou čistě biologické samozřejmosti.",
  },
  {
    title: "Uses of the Erotic: The Erotic as Power",
    meta: "Audre Lorde · Sister Outsider",
    url: "https://www.penguinrandomhouse.com/books/608235/sister-outsider-by-audre-lorde/",
    takeaway: "Erotično zde není zboží pro cizí pohled, ale schopnost rozeznat vlastní prožitek, radost, touhu a hranici.",
  },
  {
    title: "Cold Intimacies",
    meta: "Eva Illouz · citový kapitalismus",
    url: "https://www.politybooks.com/bookdetail?book_slug=cold-intimacies-the-making-of-emotional-capitalism--9780745639048",
    takeaway: "Blízké vztahy stále častěji popisujeme jazykem směny, investice, volby a návratnosti. Projekt zkoumá, co tato logika dělá s tělem.",
  },
  {
    title: "If...Then: Algorithmic Power and Politics",
    meta: "Taina Bucher · Oxford University Press",
    url: "https://global.oup.com/academic/product/ifthen-9780190493035",
    takeaway: "Algoritmy pouze neřadí obsah. Pomáhají vytvářet podmínky, za nichž se lidé stávají viditelnými, žádoucími nebo naopak mizí.",
  },
  {
    title: "The Platform Society",
    meta: "van Dijck, Poell & de Waal · Oxford University Press",
    url: "https://academic.oup.com/book/12378",
    takeaway: "Platformy organizují sociální provoz podle soukromých mechanismů, které zasahují i do bezpečí, dostupnosti, spravedlnosti a kontroly.",
  },
  {
    title: "Standards for Intimacy Coordinators",
    meta: "SAG-AFTRA · profesní rámec",
    url: "https://www.sagaftra.org/sites/default/files/sa_documents/SA_IntimacyCoord.pdf",
    takeaway: "Konkrétní rozsah, průběžný souhlas a choreografie nejsou překážkou tvorby, ale její pracovní infrastrukturou.",
  },
  {
    title: "Guidance for Shooting Intimacy",
    meta: "Bectu / Equity · praktická metodika",
    url: "https://www.equity.org.uk/media/3u5pez2c/bectu-guidance-for-shooting-intimacy-october-2022.pdf",
    takeaway: "Metodika řeší uzavřený set, popis natáčené situace, omezení improvizace a práci s nahotou bez eufemismů.",
  },
];

const projectChapters = [
  {
    n: "01",
    visual: "/gallery/organicky-povrch.webp",
    title: "Videoportrét začíná na povrchu",
    lead: "Krátký dokument spojuje detail těla a doteku se samostatným hlasem člověka. Tvář, jméno ani snadno čitelná anatomie nejsou podmínkou.",
    paragraphs: [
      "Každý film patří jednomu člověku nebo lidem, kteří chtějí vstoupit do obrazu spolu. Předpokládaná délka je tři až šest minut, deset minut je horní hranice. Kamera jde často tak blízko, že zůstává kůže, chloupky, dlaň, dech, látka, otisk a drobná změna napětí.",
      "Druhou rovnocennou vrstvu tvoří hlas. Rozhovor nemusí právě viděné gesto popisovat. Může mluvit o dětství, práci, vztazích, samotě, humoru, stěhování nebo chvíli, kdy se člověk naučil něco o vlastní hranici. Mezi obrazem a hlasem vzniká třetí význam.",
      "Všechny portréty spojuje stejná výzkumná kostra: kdy se člověk ve vlastním těle cítí jako jednající subjekt a kdy jako pozorovaný objekt, co pro něj odděluje blízkost od sexualizace a kdo podle něj vytváří význam intimního obrazu. Odpovědi se nemají sjednotit; právě jejich rozdíly tvoří sérii.",
      "Anonymita není nouzová cenzura, ale musí být konkrétní. Tvář a jméno lze vynechat, hlas přemluvit nebo změnit a poznávací znaky nesnímat. Ani potom nelze slíbit nulové riziko rozpoznání – někdo může poznat hlas, tetování, pokoj nebo vyprávěnou událost. Každý proto předem vidí, co ho může prozradit, a sám určuje přijatelnou míru.",
    ],
    points: ["3–6 minut je přirozená délka", "tvář ani jméno nejsou nutné", "obraz a hlas se navzájem neilustrují"],
  },
  {
    n: "02",
    visual: "/gallery/zlata-mriz.webp",
    title: "Proč: co nám vzali?",
    lead: "Těla jsou všude, ale možnost bezpečné blízkosti, času a pozornosti není rozdělená rovnoměrně. Profil se stává nabídkou a vztah výkonem.",
    paragraphs: [
      "Projekt vychází z napětí mezi viditelností těla a možností opravdu v něm žít. Reklama nabízí tělo jako nekonečný projekt, platformy třídí přitažlivost do shod a dosahu a pornografický průmysl často převádí intimitu na měřitelný výkon s předvídatelným koncem.",
      "Eva Illouz popisuje, jak tržní jazyk vstupuje do citů: mluvíme o investici, hodnotě, dostupnosti a návratnosti. Taina Bucher a autoři Platform Society ukazují, že algoritmy a rozhraní nejsou neutrální kulisa; aktivně organizují viditelnost a sociální jednání.",
      "Husí kůže nechce předstírat návrat do nevinného světa před internetem. Hledá malý prostor, v němž člověk není profil ani materiál k vytěžení, ale spoluautor významu vlastního těla.",
    ],
    points: ["intimita není odměna za výkon", "pozornost není totéž co blízkost", "viditelnost není totéž co možnost rozhodovat"],
    article: { href: "/texty/kdo-vlastni-nasi-blizkost", label: "Číst makrostudii: Kdo vlastní naši blízkost? ↗" },
  },
  {
    n: "03",
    visual: "/gallery/drevo-telo.webp",
    title: "Od oblečení po nahotu",
    lead: "Portrét může vzniknout v běžném oblečení, v plavkách, bez trička i nahý. Nahota je možnost, ne podmínka ani očekávaný výsledek.",
    paragraphs: [
      "Obraz může být úplně nenápadný: dva lidé leží vedle sebe, dlaň spočívá na zádech přes tričko, někdo češe vlasy nebo se nechá obejmout. Intimita nezačíná svlečením. Může být v dechu, odpočinku, blízkosti i v tom, že člověk dovolí kameře zůstat poblíž.",
      "Součástí série mohou být také otevřenější a nahé portréty, ale u konkrétního člověka to nikdy není skryté zadání. Rozsah se domlouvá předem a může se během přípravy i natáčení jen zmenšovat. Není potřeba se od oblečení postupně „propracovat“ k nahotě a nikdo nebude přesvědčovaný, aby posunul hranici.",
      "Portrét v oblečení není zkušební ani méně odvážná verze. Nahý portrét zase není automaticky upřímnější. Smysl má jen taková podoba, ve které se člověk poznává a kterou chce opravdu zveřejnit – třeba dotek přes svetr, hlas bez tváře nebo pouhá přítomnost dvou lidí v jednom prostoru.",
    ],
    points: ["oblečení i nahota jsou rovnocenné možnosti", "rozsah se domlouvá konkrétně", "změna názoru platí kdykoli"],
  },
  {
    n: "04",
    visual: "/gallery/ty-to-zvladnes-rukopis.webp",
    title: "Kdo vstupuje do obrazu a kdo mluví",
    lead: "Série je otevřená dospělým lidem bez ohledu na gender, věk, tělo, orientaci nebo vztahové uspořádání. Blízkost nemusí být jen párová.",
    paragraphs: [
      "Někdo přijde sám, někdo s partnerem, kamarádem, blízkou osobou nebo skupinou. Blízkost může být milenecká, přátelská, pečující, komunitní, polyamorní, hravá nebo těžko pojmenovatelná. Nikdo není rekvizitou pro cizí portrét.",
      "Rozhovor probíhá samostatně, bez obrazu a v tempu, které člověku vyhovuje. Otázky dostane dopředu. Neptají se jen na dotek, ale na situace, v nichž se vztah k blízkosti utvářel: domov, práce, nemoc, první lásky, přátelství, stud i místa, kde se člověk cítil cize.",
      "Po natáčení následuje krátké ohlédnutí nad konkrétní zkušeností. Není to kontrola správné emoce, ale další chvíle, kdy lze pojmenovat překvapení, nepohodu, potřebu ubrat nebo něco ve střihu nenechat.",
    ],
    points: ["pouze dospělí 18+", "sám, ve dvojici i ve skupině", "hlas může zůstat anonymní"],
    article: { href: "/texty/telo-se-uci-kulturu", label: "Číst makrostudii: Tělo se učí kulturu ↗" },
  },
  {
    n: "05",
    visual: "/gallery/kresba-vrstvy.webp",
    title: "Tak blízko, až se tělo stane krajinou",
    lead: "Obraz nehledá anatomický katalog. Sleduje póry, tlak, světlo, záhyb, jizvu a materiály, které nesou podobnou paměť jako tělo.",
    paragraphs: [
      "Detail může být ostrý a syrový, jindy se rozpadne v páře, skle, odrazu, průsvitné látce nebo mělké hloubce ostrosti. Styl není jeden filtr aplikovaný na všechny. Vychází z konkrétního člověka, místa a druhu blízkosti.",
      "Prostředím může být byt, vypůjčený ateliér, prádelna, skleník, les, auto v dešti nebo pokoj změněný jednou lampou. Mezi záběry těla mohou vstupovat mokrá látka, kůra, vlas na polštáři nebo matrace vracející se do původního tvaru.",
      "Zvuk poslouchá povrch: dlaň na kůži, polknutí, dech, bosý krok, vrzání matrace a tření látky. Hudba je možnost, ne příkaz k emoci. Někdy je nejpřesnější soundtrack lednice, déšť a ticho mezi dvěma nádechy.",
    ],
    points: ["detail místo anatomické mapy", "místo je součást portrétu", "kůže, látka, dech a ticho"],
    article: { href: "/texty/kuze-filmu", label: "Číst makrostudii: Když se obraz dívá kůží ↗" },
  },
  {
    n: "06",
    visual: "/gallery/cerveny-signal-optimized.webp",
    title: "Souhlas není podpis. Je to způsob práce.",
    lead: "Domluva pokračuje před kamerou, během natáčení, ve střižně i před každým novým uvedením. Jedno ano neplatí automaticky na všechno.",
    paragraphs: [
      "První setkání probíhá bez kamery a bez závazku. Konkrétně se pojmenuje obraz, dotek, případná nahota, anonymita, zvuk i zamýšlené použití. Stejně důležité je říct, co v portrétu nebude.",
      "Na místě se pracuje střízlivě, v uzavřeném prostoru podle potřeb účastníků a s domluveným stop slovem či gestem. Nový nápad se nejdřív vysloví. Pokračuje se až ve chvíli, kdy všichni vědí, co se mění, a opravdu to chtějí zkusit.",
      "Účastníci vidí pracovní i finální střih. Zvlášť schvalují konkrétní verzi a okruh použití: portfolio, web, projekci, výstavu, sociální síť nebo festival. Před zveřejněním lze souhlas stáhnout; po veřejném uvedení už nelze poctivě slíbit, že nikde nezůstane kopie. Právě proto se riziko a dosah řeší ještě před prvním zveřejněním. Nová montáž citlivého materiálu znamená nový dialog.",
    ],
    points: ["setkání bez kamery", "stop bez vysvětlování", "každé použití se schvaluje zvlášť"],
    article: { href: "/texty/souhlas-je-infrastruktura", label: "Číst makrostudii: Souhlas je infrastruktura ↗" },
  },
  {
    n: "07",
    visual: "/gallery/zimni-les.webp",
    title: "Co vznikne a kudy to může jít",
    lead: "Nejdřív přesný krátký film, potom případně větší plán. Série nevzniká jako továrna na obsah ani jako automatická přehlídka všech účastníků.",
    paragraphs: [
      "První fáze počítá s několika samostatnými portréty. Vedle nich vzniká autorská montáž pro přijímací portfolio na dokumentární, filmové a multimediální školy. Do ní se z projektu dostanou pouze samostatně schválené záběry.",
      "Celé filmy mohou žít na vlastním webu s věkovou bránou, v komorních projekcích, galeriích, instalacích a na dokumentárních, experimentálních, queer nebo mezioborových festivalech. Sociální sítě intimní obraz často smažou; pornografické platformy mu naopak přisoudí jiný účel. Vlastní rámec proto chrání význam filmu.",
      "Projekt vzniká komorně, s dostupnou technikou, vypůjčenými místy a malým štábem. Punk a DIY tu neznamenají ledabylost, ale schopnost spojit přesný záměr s omezenými prostředky a otevřeností k živému člověku.",
      "Dobrovolná podpora nejdřív pokrývá prokazatelné náklady projektu. Pokud po jejich uhrazení vznikne přebytek, nebude osobním ziskem autora: půjde tematicky souvisejícím organizacím a dobročinným aktivitám.",
    ],
    points: ["samostatný portrét", "postupně rostoucí série", "portfolio jen ze schválených záběrů"],
  },
  {
    n: "08",
    visual: "/gallery/brutalistni-okulus.webp",
    title: "Odbornost, malý tým a přiznané limity",
    lead: "Jde o komorní autorský film v rané fázi. Malý tým sám o sobě nezaručuje bezpečí, proto se rozsah práce musí řídit tím, co skutečně dokážeme připravit a uhlídat.",
    paragraphs: [
      "Projekt je nízkorozpočtový a nemá za sebou velkou instituci ani stálý profesionální štáb. Nechci to skrývat ani vydávat za přednost. Čím citlivější situace vznikne, tím víc potřebuje přípravy, přesnější dohodu a podle potřeby také další odbornou osobu. Když na něco kapacita nestačí, zmenší se rozsah natáčení.",
      "Komorní tým může snížit počet cizích lidí v místnosti a zpřehlednit, kdo za co odpovídá. Zároveň koncentruje moc u autora. Proto účastník vstupuje i do přípravy a střihu, první schůzka probíhá bez kamery a krásný záběr nemá přednost před změnou názoru.",
      "V první fázi není účast honorovaná. Není to náhrada placené herecké práce ani slib, že člověka projekt profesně „někam posune“. Jde o dobrovolné spoluautorství vlastního portrétu. Kdo hledá placenou roli nebo jiný druh herecké práce, může projekt bez výčitek odmítnout. Pokud získá finance, práce se má platit.",
    ],
    points: ["limity říkám předem", "rozsah se řídí skutečnou kapacitou", "odmítnout je naprosto v pořádku"],
    article: { href: "/texty/kdo-smi-tvorit", label: "Číst esej: Kdo smí tvořit, když nemá velký štáb? ↗" },
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = normalizeLocale((await searchParams)?.lang);
  const localizedEssays = getLocalizedEssays(locale);
  const localizedChapters = localizeDeep(projectChapters, locale);
  const localizedGalleryCategories = localizeDeep(siteContent.galleryCategories, locale);
  const localizedResearch = localizeDeep(researchLinks, locale);
  const coreEssays = localizedEssays.slice(0, 3);
  const ideaEssays = localizedEssays.slice(3);
  const logotypeSrc = locale === "en"
    ? "/brand/logotyp-en.svg"
    : locale === "uk"
      ? "/brand/logotyp-uk.svg"
      : "/brand/logotyp.svg";
  const pdfHref = locale === "en"
    ? "/downloads/goosebumps-project-concept-en.pdf"
    : locale === "uk"
      ? "/downloads/husyacha-shkira-kontseptsiya-uk.pdf"
      : "/downloads/husi-kuze-koncepce-cs.pdf";

  return (
    <main className="modernHome">
      <AgeGate locale={locale} />
      <SiteHeader locale={locale} />

      <section id="top" className="modernHero">
        <div className="modernHeroCopy">
          <p className="sectionLabel">{t(locale, "Filmové portréty doteku · pracovní projekt")}</p>
          <h1>
            <img src={logotypeSrc} alt={t(locale, "FOOTAGE: HUSÍ KŮŽE")} width="680" height="610" />
          </h1>
          <p className="heroLeadModern">{t(locale, "Série krátkých filmových portrétů o doteku, blízkosti a o tom, co s tělem dělá důvěra.")}</p>
          <p className="heroText">{t(locale, "Portrét může zůstat úplně v běžném oblečení a zachytit hlas, dech, objetí nebo dotek přes látku. Plavky, částečné odhalení i nahota jsou další možnosti, ne stupně, ke kterým se má člověk propracovat. Tvář ani jméno nejsou podmínkou.")}</p>
          <div className="heroLinks">
            <a className="buttonStrong" href={pdfHref} target="_blank" rel="noreferrer">{t(locale, "Otevřít stručné PDF ↗")}</a>
            <a className="buttonQuiet" href="#texty">{t(locale, "Číst autorské texty ↓")}</a>
          </div>
        </div>
        <ZoomableImage
          className="heroZoom"
          src="/gallery/jehelnice-lebka.webp"
          alt={t(locale, "Stylizovaná lebka s očima obklopenýma špendlíky")}
          title={t(locale, "Obrana / autoportrét")}
          caption={t(locale, "Senzorická přecitlivělost jako výchozí obraz projektu: ochranný systém, který brání zranění, ale někdy také blízkosti.")}
          eager
        />
      </section>

      <section className="pdfEntry" aria-labelledby="pdf-title">
        <figure className="pdfCover">
          <img src="/media/pdf-cover.webp" alt={t(locale, "Titulní strana obrazové koncepce Husí kůže")} loading="lazy" decoding="async" />
        </figure>
        <div className="pdfCopy">
          <p className="sectionLabel">{t(locale, "Stručná obrazová verze")}</p>
          <h2 id="pdf-title">{t(locale, "Nejdřív si projekt prohlédni.")}</h2>
          <p>{t(locale, "Obraz, hlas, škála intimity, hranice i způsob práce v jedné soustředěné koncepci. Bez nutnosti číst celý web.")}</p>
          <div className="pdfActions">
            <a href={pdfHref} target="_blank" rel="noreferrer">{t(locale, "Prohlédnout PDF ↗")}</a>
            <a href={pdfHref} download>{t(locale, "Uložit do zařízení ↓")}</a>
          </div>
        </div>
      </section>

      <section className="researchQuestion" aria-labelledby="research-question-title">
        <p className="sectionLabel">{t(locale, "Ústřední výzkumná otázka")}</p>
        <h2 id="research-question-title">{t(locale, "Kdy je tělo v obraze ještě přítomným subjektem – a kdy už se mění v objekt pro cizí pohled?")}</h2>
        <div className="researchBody">
          <div>
            <p>{t(locale, "Každý portrét zkoumá stejnou hranici: co způsobí, že blízký obraz působí něžně, pečujícím způsobem, sexuálně, klinicky nebo objektifikujícím dojmem? Význam nevytváří množství odhalené kůže, ale vztah, kompozice, zvuk, střih, kulturní zkušenost a moc rozhodnout, co smí být vidět.")}</p>
            <p>{t(locale, "Účastníci dostávají společnou kostru otázek, ale film po nich nechce jednotnou odpověď. Zajímá ho okamžik, kdy se člověk v obraze ještě poznává jako někdo, kdo jedná – a kdy má pocit, že už je pouze materiálem, o němž rozhoduje někdo jiný.")}</p>
          </div>
          <figure className="researchVisual">
            <img src="/gallery/sklenene-oko-extreme-optimized.webp" alt={t(locale, "Abstraktní pohled přes zakřivené sklo")} loading="lazy" decoding="async" />
            <img src="/gallery/umlcena-tvar.webp" alt={t(locale, "Kresba tváře s očima a ústy překrytými tmavými pásy")} loading="lazy" decoding="async" />
            <figcaption>{t(locale, "Pohled, který deformuje, a tvář, jejíž hlas prochází přes cizí filtr.")}</figcaption>
          </figure>
        </div>
      </section>

      <section className="decisionSection" aria-labelledby="decision-title">
        <header>
          <p className="sectionLabel">{t(locale, "Než se rozhodneš")}</p>
          <h2 id="decision-title">{t(locale, "Nehledám výkon, odvahu ani automatické ano.")}</h2>
          <p>{t(locale, "Projekt není pro každého a odmítnutí není chyba v komunikaci. Tohle jsou věci, které mají být jasné dřív, než vůbec dojde na první schůzku.")}</p>
        </header>
        <div className="decisionGrid">
          {[
            [
              "Nahota není podmínka ani skrytý cíl.",
              "Portrét může zůstat v běžném oblečení, pracovat jen s hlasem nebo zachytit blízkost bez sexuálního významu. Otevřenější poloha se řeší pouze s člověkem, který ji sám chce – nepovažuje se za odvážnější ani hodnotnější výsledek.",
            ],
            [
              "Nejde o hereckou roli.",
              "Nikdo nemá zahrát intimitu, předvést emoci ani splnit režijní zadání. Účast není náhrada placené herecké práce ani slib materiálu do showreelu. Jde o spoluautorství vlastního dokumentárního portrétu.",
            ],
            [
              "Anonymita se plánuje, neslibuje kouzlem.",
              "Tvář ani jméno nejsou potřeba a lze změnit hlas i skrýt poznávací znaky. Úplnou nerozpoznatelnost ale nelze garantovat, protože člověka může prozradit hlas, tetování, prostředí nebo příběh. Riziko se proto probírá konkrétně předem.",
            ],
            [
              "První schůzka není casting.",
              "Probíhá bez kamery, bez svlékání a bez závazku. Jejím cílem není člověka přesvědčit, ale zjistit, zda si obě strany rozumějí, zda projekt dává smysl a jaká podoba by vůbec mohla být bezpečná.",
            ],
            [
              "Schválení má konkrétní rozsah.",
              "Účastník vidí pracovní i finální střih a schvaluje zvlášť konkrétní verzi i způsob uvedení. Před zveřejněním může souhlas stáhnout. Po veřejném uvedení už internet neumí zaručit odstranění všech kopií, proto se dosah řeší předem bez eufemismů.",
            ],
            [
              "Odmítnutí není problém k vyřešení.",
              "Někdo nechce své tělo nebo intimitu veřejně sdílet ani anonymně a nepotřebuje k tomu lepší argument. Zpětná vazba ani anonymní formulář nejsou nábor oklikou. Ne, nejistota i ticho zůstávají platnými odpověďmi.",
            ],
          ].map(([title, body], index) => (
            <details key={title}>
              <summary><span>0{index + 1}</span><strong>{t(locale, title)}</strong><b aria-hidden="true">+</b></summary>
              <div className="decisionContent">
                <img src={decisionImages[index]} alt="" loading="lazy" decoding="async" />
                <p>{t(locale, body)}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section id="texty" className="storySection">
        <header className="compactHead">
          <p className="sectionLabel">{t(locale, "3 texty přímo k filmu")}</p>
          <h2>{t(locale, "Nejdřív obraz, tělo a způsob práce.")}</h2>
          <p>{t(locale, "Tři základní makrostudie vysvětlují, proč dotek není univerzální jazyk, jak může kamera místo anatomie vnímat povrch a proč souhlas pokračuje i ve střižně.")}</p>
        </header>
        <div className="storyGrid">
          {coreEssays.map((essay, index) => (
            <article
              className={index === 0 ? "storyCard storyCardFeatured" : "storyCard"}
              data-essay={essay.slug}
              key={essay.slug}
            >
              <ZoomableImage
                className="storyImage"
                src={essay.cover}
                alt={essay.coverAlt}
                title={essay.title}
                caption={t(locale, "Obrazová studie k autorskému textu projektu Husí kůže.")}
              />
              <a className="storyCopy" href={withLocale(`/texty/${essay.slug}`, locale)}>
                <span>0{index + 1} · {essay.kicker}</span>
                <h3>{essay.title}</h3>
                <p>{essay.dek}</p>
                <strong>{getEssayReadingTime(essay, locale)} · {t(locale, "číst celý text ↗")}</strong>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="uvahy" className="ideaSection" aria-labelledby="ideas-title">
        <header className="ideaHead">
          <p className="sectionLabel">{t(locale, "Myšlenkové podloží")} · {ideaEssays.length} {t(locale, "esejí")}</p>
          <h2 id="ideas-title">{t(locale, "Co je za obrazem.")}</h2>
          <p>{t(locale, "Intimita pod vládou platforem, kulturně naučené tělo, technoanarchismus, demokratizace tvorby, generativní AI, Umění hoven a osobní cesta od obrany k možnosti blízkosti.")}</p>
        </header>
        <div className="ideaGrid">
          {ideaEssays.map((essay, index) => (
            <article className="ideaCard" data-essay={essay.slug} key={essay.slug}>
              <ZoomableImage
                className="ideaImage"
                src={essay.cover}
                alt={essay.coverAlt}
                title={essay.title}
                caption={t(locale, "Obrazová studie k eseji projektu Husí kůže.")}
              />
              <a href={withLocale(`/texty/${essay.slug}`, locale)}>
                <span>{String(index + 4).padStart(2, "0")} · {essay.kicker}</span>
                <h3>{essay.title}</h3>
                <p>{essay.dek}</p>
                <strong>{getEssayReadingTime(essay, locale)} · {t(locale, "otevřít esej ↗")}</strong>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="projekt" className="projectGuide">
        <header className="guideHead">
          <p className="sectionLabel">{t(locale, "Podrobná koncepce · 8 kapitol")}</p>
          <h2>{t(locale, "Jak může portrét vypadat a jak vzniká.")}</h2>
          <p>{t(locale, "Osm rozbalovacích kapitol popisuje obraz, hlas, míru odhalení, průběh natáčení i schvalování výsledku. Zavřené dávají rychlý přehled, otevřené jdou do konkrétního postupu.")}</p>
        </header>
        <div className="guideList">
          {localizedChapters.map((chapter) => (
            <details className="guideChapter" key={chapter.n}>
              <summary>
                <span className="guideNumber">{chapter.n}</span>
                <span className="guideSummaryCopy">
                  <strong>{chapter.title}</strong>
                  <small>{chapter.lead}</small>
                </span>
                <span className="guidePlus" aria-hidden="true">+</span>
              </summary>
              <div className="guideBody">
                <ZoomableImage
                  className="guideVisual"
                  src={chapter.visual}
                  alt={chapter.title}
                  title={chapter.title}
                  caption={t(locale, "Obrazová poznámka k této kapitole koncepce.")}
                />
                <div className="guideText">
                  {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {chapter.n === "03" && (
                    <>
                      <div className="freedomSpectrum" aria-label={t(locale, "Možná míra odhalení v portrétu")}>
                        <div><span>01</span><strong>{t(locale, "Oblečení")}</strong><small>{t(locale, "Dotek přes látku, objetí, vlasy, dech.")}</small></div>
                        <div><span>02</span><strong>{t(locale, "Plavky")}</strong><small>{t(locale, "Částečně odkryté tělo bez nahoty.")}</small></div>
                        <div><span>03</span><strong>{t(locale, "Bez trička")}</strong><small>{t(locale, "Rozsah i způsob snímání se domluví předem.")}</small></div>
                        <div><span>04</span><strong>{t(locale, "Nahota")}</strong><small>{t(locale, "Vítaná možnost pouze pro toho, kdo ji sám chce.")}</small></div>
                      </div>
                      <p className="spectrumNote"><strong>{t(locale, "Neexistuje správná míra odhalení.")}</strong> {t(locale, "Projekt chce zachytit celou škálu, ne dostat každého člověka na její konec.")}</p>
                    </>
                  )}
                  {chapter.article && <a className="guideArticleLink" href={withLocale(chapter.article.href, locale)}>{chapter.article.label}</a>}
                </div>
                <aside className="guidePoints" aria-label={`Klíčové body kapitoly ${chapter.title}`}>
                  <span>{t(locale, "V praxi")}</span>
                  {chapter.points.map((point) => <strong key={point}>{point}</strong>)}
                </aside>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section id="formular" className="formSection" aria-labelledby="form-title">
        <ProjectForm locale={locale} />
      </section>

      <section id="obraz" className="gallerySection">
        <header className="compactHead compactHeadLight">
          <p className="sectionLabel">{t(locale, "Obrazový materiál")}</p>
          <h2>{t(locale, "Klikni. Obraz se otevře i s kontextem.")}</h2>
          <p>{t(locale, "Galerie je vodorovná, aby z webu nebyl scrollovací sarkofág. Tažením nebo kolečkem pokračuješ doprava.")}</p>
        </header>
        {localizedGalleryCategories.map((category) => (
          <section className="galleryCategory" key={category.id}>
            <header>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </header>
            <div className="horizontalGallery">
              {category.images.map((image) => (
                <ZoomableImage
                  key={image.src}
                  className="galleryItem"
                  src={image.src}
                  alt={image.alt}
                  title={image.title}
                  caption={image.caption}
                  protectedPreview={"protectedPreview" in image ? image.protectedPreview : false}
                />
              ))}
            </div>
          </section>
        ))}
      </section>

      <section id="dukazy" className="evidenceSection">
        <header className="evidenceHead">
          <p className="sectionLabel">{t(locale, "Důkazy, teorie a pracovní standardy")}</p>
          <h2>{t(locale, "Na čem projekt stojí.")}</h2>
          <p>{t(locale, "U každého zdroje píšu, co z něj pro projekt vyvozuju a co už by bylo přehánění. Odkazy vedou přímo na studii, knihu nebo profesní metodiku.")}</p>
          <div className="evidenceVisual" aria-hidden="true">
            <img src="/gallery/brutalistni-okulus.webp" alt="" loading="lazy" decoding="async" />
            <img src="/gallery/konstruktivisticka-vez.webp" alt="" loading="lazy" decoding="async" />
            <img src="/gallery/organicka-propast.webp" alt="" loading="lazy" decoding="async" />
          </div>
        </header>
        <div className="evidenceGrid">
          {localizedResearch.map((item, index) => (
            <a href={item.url} target="_blank" rel="noreferrer" key={item.title}>
              <span className="evidenceNo">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
              <p>{item.takeaway}</p>
              <b>{t(locale, "Otevřít původní zdroj ↗")}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="supportSection" aria-labelledby="support-title">
        <div className="supportCopy">
          <p className="sectionLabel">{t(locale, "Podpora a transparentnost")}</p>
          <h2 id="support-title">{t(locale, "Příspěvek není vstupenka k tělu ani právo rozhodovat o filmu.")}</h2>
          <p>{t(locale, "Podpora nejdřív pokrývá prokazatelné náklady: techniku, dopravu, prostor, bezpečné uložení dat, titulky, překlady a odborné konzultace. Pokud po jejich uhrazení vznikne přebytek, nebude osobním ziskem autora. Půjde tematicky souvisejícím organizacím a dobročinným aktivitám; konkrétní příjemci budou zveřejněni až podle skutečné výše a účelu podpory.")}</p>
          <div className="accountNumber">
            <span>{t(locale, "Číslo účtu")}</span>
            <strong>2703541582 / 2010</strong>
          </div>
        </div>
        <figure className="supportQr">
          <div className="supportQrHead">
            <span>{t(locale, "Dobrovolná podpora")}</span>
            <strong>{t(locale, "Naskenuj v bankovní aplikaci")}</strong>
          </div>
          <div className="supportQrViewport">
            <img src="/podpora/qr-platba-clean.png" alt={t(locale, "QR kód pro dobrovolnou podporu projektu")} loading="lazy" decoding="async" />
          </div>
          <figcaption>
            <strong>{t(locale, "Částku určuješ ty.")}</strong>
            <span>{t(locale, "QR neobsahuje přednastavenou částku a příspěvek nevytváří žádný nárok na podobu filmu.")}</span>
          </figcaption>
        </figure>
      </section>

      <section className="authorArchive" aria-labelledby="author-archive-title">
        <header>
          <p className="sectionLabel">{t(locale, "Osobní východisko · odvaha k zranitelnosti")}</p>
          <h2 id="author-archive-title">{t(locale, "Nejdu k tématu z čisté laboratoře.")}</h2>
          <div className="authorArchiveIntro">
            <p>{t(locale, "Tyhle obrazy nejsou lineární příběh o uzdravení ani důkaz, že už mám všechno vyřešené. Jsou to různé způsoby, jak jsem se snažil být ve světě: od odpojení přes kalení a hranou roli až k pokusu znovu se nechat opravdu vidět.")}</p>
            <blockquote>{t(locale, "„Zaťatá pěst dokáže přežít úder, ale nedokáže obejmout. A některé dny byly prostě na hovno — ne poeticky, ale doopravdy.“")}</blockquote>
          </div>
        </header>
        <div className="authorArchiveGrid">
          <figure className="authorArchiveWide">
            <img src="/gallery/autor-svedsko.webp" alt={t(locale, "Štěpán sám na zamrzlém jezeře ve Švédsku")} loading="lazy" decoding="async" />
            <figcaption><strong>{t(locale, "Švédsko / odpojení")}</strong><span>{t(locale, "Z cesty za polární kruh, z období, kdy mi nebylo dobře a ticho nebylo romantické.")}</span></figcaption>
          </figure>
          <figure>
            <img src="/gallery/autor-kaleni.webp" alt={t(locale, "Rozmazaná noční fotografie Štěpána s lahví")} loading="lazy" decoding="async" />
            <figcaption><strong>{t(locale, "Kalení / únik")}</strong><span>{t(locale, "Období, kdy byl společenský pohyb často snazší než přiznaná únava a blízkost.")}</span></figcaption>
          </figure>
          <figure>
            <img src="/gallery/autor-role.webp" alt={t(locale, "Stylizovaný autoportrét Štěpána ve slaměném klobouku a růžových brýlích")} loading="lazy" decoding="async" />
            <figcaption><strong>{t(locale, "Role / maska")}</strong><span>{t(locale, "Hravá vizuální identita jako svoboda i způsob, jak schovat nejistotu před publikem.")}</span></figcaption>
          </figure>
          <figure className="authorArchivePoster">
            <img src="/gallery/autor-metafyzicka-pout.webp" alt={t(locale, "Autorská koláž Metafyzická pouť")} loading="lazy" decoding="async" />
            <figcaption><strong>{t(locale, "Metafyzická pouť / konec strachu ze zranitelnosti")}</strong><span>{t(locale, "Koláž cesty Švédsko → Praha → Prudký potok. Ne vítězný plakát, ale pracovní mapa chvíle, kdy obrana přestala být jedinou možnou polohou.")}</span></figcaption>
          </figure>
        </div>
        <aside className="unfinishedWorks" aria-label={t(locale, "Nedokončené a satirické práce")}>
          <strong>{t(locale, "Nedokončené a satirické práce")}</strong>
          <p>{t(locale, "Intolerance a Na trávě mezi stromy zůstávají pracovními pokusy a materiály k nedokončeným projektům. Hajluje celá rodina je satira na vzestup krajní pravice — ne oslava ani hudební vizitka projektu. Na webu je zmiňuju jako kontext tvorby, bez přehrávače a bez předstírání hotového díla.")}</p>
        </aside>
      </section>

      <section id="autor" className="aboutShort">
        <div className="aboutIdentity">
          <figure className="authorPhotoLocked">
            <img src="/gallery/prudky-potok-explicitni-optimized.webp" alt={t(locale, "Malý autoportrét Štěpána Chalupy v Prudkém potoce")} loading="lazy" decoding="async" />
            <figcaption>{t(locale, "Autoportrét z Prudkého potoka, 2026")}</figcaption>
          </figure>
          <div className="aboutBio">
            <p className="sectionLabel">{t(locale, "Autor a stav projektu")}</p>
            <h2>Štěpán Chalupa</h2>
            <p className="aboutLead">{t(locale, "Filmař, režisér, fotograf a autor videoesejí. Zajímá mě, jak společenské systémy prorůstají do práce, času, vztahů a obrazu, který máme o vlastním těle.")}</p>
            <p>{t(locale, "Vystudoval jsem magisterskou filmovou vědu na Masarykově univerzitě. V práci Punk, hec a esence tvoření jsem zkoumal cesty přerovských filmařů mezi amatérstvím, zakázkou, institucí a vlastní potřebou tvořit. Na stejnou otázku navazuju i prakticky: jak dělat přesnou a ambiciózní audiovizi bez čekání, až mi velká instituce laskavě udělí právo vzít do ruky kameru.")}</p>
            <p>{t(locale, "Režíroval jsem vzdělávací formát What The Fact? pro Českou televizi, pracoval v Divadle FESTE a pod jménem Fellean tvořím videoeseje, satirické formáty, fotografie a cestovní dokumentární deníky. Můj způsob práce spojuje rešerši a jasnou strukturu s DIY produkcí, improvizací a ochotou nechat do výsledku vstoupit náhodu i člověka před kamerou.")}</p>
            <p>{t(locale, "Jsem neurodivergentní a senzoricky citlivý. Dlouho pro mě byly dotek, společné šatny, hluk i obyčejné objetí spíš obranný systém než samozřejmá blízkost. Husí kůže proto nevzniká z bezpečné vzdálenosti. Zkouším v ní, jestli lze ukázat zranitelnost a přitom nepřijít o hranice. A jestli se citlivost, která mě někdy izoluje, může proměnit ve filmový jazyk.")}</p>
            <p>{t(locale, "Nezajímají mě idealizovaná reklamní těla ani jeden gender, věk či typ přitažlivosti. Zajímají mě dospělá lidská těla jako nositelé času: s jizvami, chloupky, vráskami, potem, únavou, slastí, humorem a zkušeností. Do obrazu proto vstupuju i vlastním tělem; nechci po druhých žádat riziko, které sám odmítám nést.")}</p>
            <div className="authorProof">
              <span><strong>Mgr.</strong> {t(locale, "filmová věda · MU")}</span>
              <span><strong>{t(locale, "Režie")}</strong> {t(locale, "Česká televize · What The Fact?")}</span>
              <span><strong>{t(locale, "Praxe")}</strong> {t(locale, "videoesej · dokument · fotografie")}</span>
            </div>
          </div>
        </div>
        <div className="contactBox" id="kontakt">
          <p className="sectionLabel">{t(locale, "Praha · 2026")}</p>
          <h3>{t(locale, "První setkání je bez kamery, bez závazku a bez přesvědčování.")}</h3>
          <a href="mailto:stepanchalupa@post.cz?subject=Husí kůže">{t(locale, "Napsat e-mail ↗")}</a>
          <a href="#formular">{t(locale, "Otevřít nezávazný formulář ↑")}</a>
        </div>
      </section>

      <footer className="modernFooter">
        <a className="brandMark footerBrand" href="#top"><img src="/brand/logo.svg" alt="" /><span>{t(locale, "HUSÍ KŮŽE")}</span></a>
        <p>© 2026 Štěpán Chalupa · {t(locale, "pracovní koncepce")}</p>
        <div><a href={pdfHref} target="_blank" rel="noreferrer">PDF ↗</a><a href="#formular">{t(locale, "Formulář ↑")}</a><a href="#texty">{t(locale, "Texty ↑")}</a></div>
      </footer>
    </main>
  );
}
