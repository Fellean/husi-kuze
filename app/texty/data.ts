export type StudyLink = {
  n: string;
  title: string;
  author: string;
  url: string;
  note: string;
};

export type Essay = {
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  read?: string;
  date: string;
  cover: string;
  coverAlt: string;
  thesis: string;
  sections: { title: string; paragraphs: string[]; image?: string; imageAlt?: string }[];
  sources: StudyLink[];
};

import type { Locale } from "../i18n";
import siteContent from "../content/site-content.json";

const builtInEssays: Essay[] = [
  {
    slug: "dotek-neni-univerzalni-jazyk",
    kicker: "Makrostudie 01 · tělo a společnost",
    title: "Dotek není univerzální jazyk",
    dek: "Co výzkum skutečně říká o doteku, samotě a regulaci stresu – a proč z něj nelze vyrobit povinnost nechat se objímat.",
    read: "12 min čtení",
    date: "červenec 2026",
    cover: "/gallery/puda-mravenci-optimized.webp",
    coverAlt: "Mravenci na půdě obklopují organický útvar",
    thesis: "Dotek může být zdrojem regulace, bezpečí a vztahové blízkosti. Jeho účinek ale nevzniká z pouhého kontaktu kůže s kůží; vzniká z očekávání, vztahu, kultury, minulosti a možnosti říct ne.",
    sections: [
      {
        title: "Touha po doteku není totéž co souhlas",
        paragraphs: [
          "Během pandemických omezení se „hlad po doteku“ stal veřejným pojmem. Studie Mariany von Mohr a kolektivu našla souvislost mezi nedostatkem intimního doteku, osamělostí a úzkostí. Jde ale o asociaci v mimořádném období, ne o jednoduchý důkaz, že čím více doteku, tím zdravější člověk.",
          "Výzkum navíc rozlišuje dotek chtěný, očekávaný a vztahově bezpečný od kontaktu nevyžádaného. Stejné gesto může být oporou, invazí i čistě praktickým úkonem. Tělo nečte jen tlak dlaně; čte také člověka, situaci a možnost úniku."
        ]
      },
      {
        title: "Průměr není scénář pro jednotlivce",
        paragraphs: [
          "Meta-analýza publikovaná v Nature Human Behaviour shrnula 137 studií dotekových intervencí. Popsala malé až střední přínosy pro některé ukazatele fyzického a duševního zdraví. Soubor však zahrnuje velmi rozdílné situace: od rodičovského kontaktu a masáží po kontakt s předměty či robotickými zařízeními.",
          "Výsledek na úrovni skupiny není morální instrukce pro konkrétní tělo. Neurodivergence, trauma, bolest, genderová zkušenost i kulturní návyky mění smyslovou intenzitu a význam kontaktu. Projekt proto nepoužívá vědu jako bianko šek. Používá ji jako začátek přesnější otázky."
        ],
        image: "/gallery/hreben-makro-optimized.webp",
        imageAlt: "Extrémní makro pravidelných kovových zubů"
      },
      {
        title: "Intimita jako nerovnoměrně rozdělený zdroj",
        paragraphs: [
          "Možnost zažívat bezpečnou blízkost není ve společnosti rozdělená rovnoměrně. Péče se váže na rodinu, partnerský status, zdraví, bydlení, pracovní čas i schopnost zaplatit službu. Člověk bez partnerstva, s postižením nebo mimo normativní představu žádoucnosti může být z prostoru legitimního doteku vytlačován.",
          "Tady se osobní zkušenost potkává s politikou: systém nejdřív privatizuje péči do domácnosti a potom samotu prodává jako individuální selhání. Husí kůže nechce dotek romantizovat. Chce ukázat, že hranice i potřeba blízkosti jsou skutečné společenské otázky."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Social touch deprivation during COVID-19", author: "von Mohr et al. · Royal Society Open Science · 2021", url: "https://royalsocietypublishing.org/rsos/article/8/9/210287/96157/Social-touch-deprivation-during-COVID-19-effects", note: "Open-access studie o nedostatku intimního doteku, osamělosti a úzkosti." },
      { n: "02", title: "A systematic review and multivariate meta-analysis of the physical and mental health benefits of touch interventions", author: "Packheiser et al. · Nature Human Behaviour · 2024", url: "https://doi.org/10.1038/s41562-024-01841-8", note: "Meta-analýza 137 studií dotekových intervencí." },
      { n: "03", title: "Affectionate Touch to Promote Relational, Psychological, and Physical Well-Being in Adulthood", author: "Jakubiak & Feeney · PSPR · 2017", url: "https://doi.org/10.1177/1088868316650307", note: "Teoretický přehled mechanismů láskyplného doteku." }
    ]
  },
  {
    slug: "kuze-filmu",
    kicker: "Makrostudie 02 · film a haptický obraz",
    title: "Když se obraz dívá kůží",
    dek: "Od Laury U. Marks po experimentální film: jak lze tělo snímat bez anatomického katalogu a proč rozostření někdy ukazuje přesněji než ostrost.",
    read: "14 min čtení",
    date: "červenec 2026",
    cover: "/gallery/sklenene-oko-extreme-optimized.webp",
    coverAlt: "Abstraktní kruhový pohled skrze sklo",
    thesis: "Haptický obraz nenabízí tělo jako objekt k okamžitému přečtení. Zpomaluje jistotu pohledu a nutí diváka vnímat povrch, měřítko, zvuk a vlastní tělesnou paměť.",
    sections: [
      {
        title: "Optický pohled ví. Haptický pohled tápe.",
        paragraphs: [
          "Laura U. Marks popisuje haptickou vizualitu jako režim, v němž se oko chová skoro jako orgán hmatu. Obraz není čistým oknem do prostoru. Je povrchem, k němuž se divák přibližuje, aniž jej může vlastnit jediným pohledem.",
          "Extrémní detail, zrno, malá hloubka ostrosti nebo ztráta měřítka mohou rozrušit naučenou anatomickou orientaci. Kůže přestane být důkazem identity a stane se krajinou. Nejde o estetickou mlhu pro mlhu samotnou, ale o odmítnutí pohledu, který si okamžitě přiděluje právo pojmenovat celé tělo."
        ],
        image: "/gallery/temny-lustr-extreme-optimized.webp",
        imageAlt: "Temný lustr překrytý optickými a organickými strukturami"
      },
      {
        title: "Kamera není nevinný pozorovatel",
        paragraphs: [
          "Filmová kamera dědí historii medicínského třídění, koloniálního pohledu, pornografické fragmentace i reklamního leštění. Detail může tělo osvobodit od normativního celku, ale také ho rozporcovat na zboží. Rozdíl neleží jen v kompozici. Leží v pracovním vztahu a v tom, kdo určuje význam výsledku.",
          "Proto je obrazová metoda Husí kůže neoddělitelná od souhlasu ve střihu. Účastnictvo nemá kontrolovat jen to, co se stalo před objektivem, ale také jak montáž skládá jeho tělo, hlas a čas."
        ]
      },
      {
        title: "Kdy se subjekt stane objektem?",
        paragraphs: [
          "Laura Mulvey ukázala, že sexualizace nevzniká jen nahotou samotnou. Film může postavit tělo do pozice podívané, zatímco jednání, pohled a kontrolu významu přidělí někomu jinému. Kompozice, světlo, délka záběru a střih tak nevytvářejí pouze estetiku. Organizují vztah mezi tím, kdo se dívá, a tím, kdo je vystaven pohledu.",
          "bell hooks tento model rozšířila o otázku, kdo je vůbec považován za samozřejmého diváka a kdo se v dominantním obraze stává objektem bez práva pohled opětovat. Tělo není politické jen tím, že nese gender. Do možnosti být viděn jako plný subjekt vstupují také rasa, třída, věk, postižení, žádoucnost a zkušenost s tím, kdo směl v minulosti obraz vytvářet.",
          "Husí kůže proto nehledá jednoduchou vizuální značku nesexualizovaného těla. Stejný detail může působit něžně, eroticky, klinicky i násilně podle vztahu, zvuku, montáže a možnosti zobrazeného člověka zasáhnout do výsledku. Každý portrét se ptá, kdy se v obraze ještě poznáváš jako někdo, kdo jedná – a kdy už máš pocit, že ses stal materiálem pro cizí význam."
        ]
      },
      {
        title: "Zvuk jako dotek bez obrazu",
        paragraphs: [
          "Přejetí dlaně po kůži, změna dechu nebo tření látky vytvářejí tělesnou blízkost i bez explicitního záběru. Zvuk může obraz ukotvit, ale také ho znejistit: slyšíme kontakt, jehož původ nevidíme, a doplňujeme jej vlastní zkušeností.",
          "Haptický film proto nevzniká pouze makroobjektivem. Vzniká v montáži smyslů, kde obraz, hlas a ruch nejsou ilustracemi téhož, ale třemi částečně nezávislými stopami."
        ]
      }
    ],
    sources: [
      { n: "01", title: "The Skin of the Film", author: "Laura U. Marks · Duke University Press · 2000", url: "https://www.dukeupress.edu/the-skin-of-the-film", note: "Základní monografie o haptické vizualitě a smyslové paměti." },
      { n: "02", title: "Touch: Sensuous Theory and Multisensory Media", author: "Laura U. Marks · University of Minnesota Press · 2002", url: "https://www.upress.umn.edu/9780816638895/touch/", note: "Rozvinutí smyslového přístupu k médiím a digitálním obrazům." },
      { n: "03", title: "The Address of the Eye", author: "Vivian Sobchack · Princeton University Press · 1992", url: "https://press.princeton.edu/books/paperback/9780691003313/the-address-of-the-eye", note: "Fenomenologie filmové zkušenosti a tělesně prožívaného diváctví." },
      { n: "04", title: "Visual Pleasure and Narrative Cinema", author: "Laura Mulvey · Screen · 1975", url: "https://academic.oup.com/screen/article-abstract/16/3/6/1603296", note: "Zakládající feministická analýza toho, jak film organizuje pohled, podívanou a genderovanou moc." },
      { n: "05", title: "The Oppositional Gaze", author: "bell hooks · Black Looks · 1992", url: "https://www.routledge.com/Black-Looks-Race-and-Representation/hooks/p/book/9781138821552", note: "Kritika představy univerzálního diváka a text o možnosti pohled vracet, zpochybňovat a číst proti dominantní reprezentaci." }
    ]
  },
  {
    slug: "souhlas-je-infrastruktura",
    kicker: "Makrostudie 03 · etika filmové práce",
    title: "Souhlas není podpis. Je to infrastruktura.",
    dek: "Proč jednorázové ano nestačí, co mění mocenská asymetrie natáčení a jak převést profesní standardy intimních scén do malého autorského dokumentu.",
    read: "13 min čtení",
    date: "červenec 2026",
    cover: "/gallery/cerveny-signal-optimized.webp",
    coverAlt: "Rozpadlý červený digitální obraz připomínající varovný signál",
    thesis: "Etická práce nevzniká tím, že lidé před kamerou podepíšou formulář. Vzniká soustavou konkrétních možností rozhodovat před kamerou, během natáčení, ve střihu i při každém novém uvedení.",
    sections: [
      {
        title: "Formální souhlas a skutečná možnost odmítnout",
        paragraphs: [
          "Kamera vytváří mocenskou asymetrii, i když je štáb malý a všichni si tykají. Autor kontroluje techniku, čas, výběr záběrů i budoucí kontext. Účastník může říct ano, protože nechce zklamat, protože už dorazil na místo nebo protože změna rozhodnutí působí jako komplikace.",
          "Proto musí být odmítnutí organizačně snadné, ne pouze právně možné. Pomáhá oddělit první schůzku od natáčení, přesně pojmenovat rozsah, domluvit stop gesto, neimprovizovat kontakt bez nové otázky a nesankcionovat změnu názoru."
        ]
      },
      {
        title: "Souhlas pokračuje ve střižně",
        paragraphs: [
          "Intimní obraz nemění význam jen tím, co zachycuje, ale tím, co stojí před ním a za ním. Neutrální detail může montáž proměnit v sexualizaci, zesměšnění nebo diagnostický důkaz. Schválení natáčení proto automaticky neznamená schválení každého střihu.",
          "Husí kůže rozlišuje pracovní materiál, konkrétní finální verzi a okruh uvedení. Portfolio, festival, veřejný web a sociální síť nejsou jeden souhlas. Každé prostředí má jinou dohledatelnost, publikum a riziko vytržení z kontextu."
        ],
        image: "/gallery/zelena-lebka-optimized.webp",
        imageAlt: "Zeleně nasvícená stylizovaná lebka se špendlíky"
      },
      {
        title: "Standard není kouzelný talisman",
        paragraphs: [
          "Metodiky SAG-AFTRA, Bectu a Equity vznikly především pro profesionální hranou tvorbu. Malý dokument nemůže mechanicky předstírat podmínky velkého štábu ani titul koordinátora intimity. Může ale převzít principy: předvídatelnost, uzavřený set, konkrétní popis, průběžné ověřování hranic a oddělení tvůrčího nadšení od tlaku na výkon.",
          "Transparentní přiznání limitů je bezpečnější než estetika profesionality bez skutečné kapacity. Etika není certifikát pověšený na webu; je to praktická možnost zastavit proces, i když to zničí krásný záběr."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Standards and Protocols for the Use of Intimacy Coordinators", author: "SAG-AFTRA", url: "https://www.sagaftra.org/sites/default/files/sa_documents/SA_IntimacyCoord.pdf", note: "Profesní rámec pro práci koordinátorů intimity napříč produkcí." },
      { n: "02", title: "Bectu guidance for shooting intimacy", author: "Bectu & Equity · 2022", url: "https://www.equity.org.uk/media/3u5pez2c/bectu-guidance-for-shooting-intimacy-october-2022.pdf", note: "Praktická metodika pro nahotu, simulovaný sex, uzavřený set a hranice." },
      { n: "03", title: "A guideline for student film engagements", author: "Equity · 2023", url: "https://www.equity.org.uk/advice-and-support/know-your-rights/student-film-engagement", note: "Konkrétní pravidla pro nahotu, informování předem a omezení použití materiálu." }
    ]
  },
  {
    slug: "kdo-vlastni-nasi-blizkost",
    kicker: "Makrostudie 04 · intimita a platformy",
    title: "Kdo vlastní naši blízkost?",
    dek: "Profil, shoda, dosah a osobní značka: jak tržní a platformová logika organizuje vztahy – a proč řešením není nostalgie po světě bez internetu.",
    read: "15 min čtení",
    date: "červenec 2026",
    cover: "/gallery/praha.webp",
    coverAlt: "Pražská městská struktura viděná šikmou perspektivou",
    thesis: "Platformy nevymyslely lidskou osamělost ani nerovnost v přístupu k blízkosti. Vytvořily však infrastrukturu, která sociální pozornost třídí, měří a převádí na soukromou hodnotu – a tím mění i způsob, jakým se učíme nabízet sami sebe.",
    sections: [
      {
        title: "Profil je uživatelské rozhraní člověka",
        paragraphs: [
          "Seznamovací a sociální platformy potřebují převést člověka do podoby, kterou lze rychle zobrazit, porovnat a zařadit. Fotografie, několik vět, věk, vzdálenost, zájmy a reakce vytvoří profil, jenž není lží, ale nutně zplošťuje. Neviditelné zůstává tempo důvěry, tělesná paměť, rozpaky, proměnlivost i to, co se dá zjistit pouze časem.",
          "Taina Bucher ukazuje, že algoritmická moc nespočívá jen v tajném seznamu pravidel. Algoritmy a rozhraní vytvářejí podmínky toho, co se jeví jako relevantní, dosažitelné a vůbec představitelné. Ve vztazích to znamená, že platforma nehraje roli neutrálního tržiště. Spoluurčuje rytmus volby, viditelnosti a odmítnutí."
        ],
        image: "/gallery/sikma-fasada.webp",
        imageAlt: "Nakloněná fasáda jako obraz nejisté perspektivy"
      },
      {
        title: "Citový kapitalismus neznamená falešné city",
        paragraphs: [
          "Eva Illouz pojmem citový kapitalismus neříká, že láska nebo touha přestaly být opravdové. Popisuje prorůstání ekonomických modelů do intimního života: vztah lze chápat jako investici, člověka jako soubor vlastností a rozhodnutí jako optimalizaci mezi nabídkami. Jazyk trhu se stává natolik běžný, že jej používáme i tehdy, když chceme mluvit o bezpečí nebo blízkosti.",
          "Stejná logika proniká do těla. Viditelnost se snadno zamění za hodnotu, pozornost za zájem a vysoký počet reakcí za důkaz žádoucnosti. Tělo se mění v projekt, který má nepřetržitě dokazovat, že je disciplinované, spontánní, přitažlivé a zároveň autentické. Je to dost absurdní pracovní pohovor na pozici vlastního já."
        ]
      },
      {
        title: "Vzít si intimitu zpátky není útěk z technologií",
        paragraphs: [
          "Kritika platforem nemá smysl, pokud romantizuje minulost. Digitální prostředí umožnilo queer lidem, neurodivergentním lidem i lidem mimo velká města najít vztahy, jazyk a komunitu, k nimž by jinak nemuseli získat přístup. Problémem není spojení přes obrazovku, ale soukromá infrastruktura, která spojení organizuje podle vlastního obchodního modelu.",
          "Husí kůže zkouší malý opačný postup. Nejdřív vzniká vztah a domluva, teprve potom obraz. Člověk není hotový profil vstupující do předem daného formátu; filmový tvar se skládá kolem něj. Nejde o řešení platformového kapitalismu jedním portrétem. Jde o praktický důkaz, že audiovizuální vztah může být organizovaný i jinak."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Cold Intimacies: The Making of Emotional Capitalism", author: "Eva Illouz · Polity · 2007", url: "https://www.politybooks.com/bookdetail?book_slug=cold-intimacies-the-making-of-emotional-capitalism--9780745639048", note: "Teoretické zázemí pojmu citový kapitalismus a prorůstání ekonomického jazyka do intimních vztahů." },
      { n: "02", title: "If...Then: Algorithmic Power and Politics", author: "Taina Bucher · Oxford University Press · 2018", url: "https://global.oup.com/academic/product/ifthen-9780190493035", note: "Analýza toho, jak algoritmy vytvářejí podmínky sociální viditelnosti a jednání." },
      { n: "03", title: "The Platform Society", author: "José van Dijck, Thomas Poell & Martijn de Waal · OUP · 2018", url: "https://academic.oup.com/book/12378", note: "Platformy jako infrastruktura sociálního provozu, v níž se střetávají soukromé mechanismy s veřejnými hodnotami." },
      { n: "04", title: "Sister Outsider", author: "Audre Lorde · Penguin Modern Classics", url: "https://www.penguinrandomhouse.com/books/608235/sister-outsider-by-audre-lorde/", note: "Sbírka obsahuje esej Uses of the Erotic, která odlišuje vlastní plnost prožitku od jeho komerčního a patriarchálního zploštění." }
    ]
  },
  {
    slug: "telo-se-uci-kulturu",
    kicker: "Makrostudie 05 · antropologie doteku",
    title: "Tělo se učí kulturu",
    dek: "Stud, gesto, objetí i vzdálenost vypadají přirozeně hlavně proto, že jsme je trénovali celý život. Co to mění na filmu, který chce kulturní kód těla zkoumat?",
    read: "13 min čtení",
    date: "červenec 2026",
    cover: "/gallery/kresba-vrstvy.webp",
    coverAlt: "Kresba překrývajících se vrstev těla a krajiny",
    thesis: "Tělo není pasivní biologický základ, na který kultura teprve přidává význam. Způsob, jak stojíme, mlčíme, zakrýváme se a dovolujeme dotek, vzniká učením – a právě proto jej lze vědomě zkoumat a měnit, nikoli však přepsat přes cizí hranice.",
    sections: [
      {
        title: "Přirozené gesto má dlouhou historii",
        paragraphs: [
          "Marcel Mauss nazval technikami těla způsoby, jimiž se lidé v různých společnostech učí používat vlastní tělo. Chůze, plavání, spánek, držení nástroje nebo pozdrav nejsou čistě osobní improvizace. Učíme se je pozorováním, výchovou, institucemi, prostředím a představou toho, co působí správně.",
          "Stejnou optikou lze číst dotek. Kdo smí koho obejmout, které části těla zůstávají veřejné, jak dlouho může kontakt trvat a zda péče působí něžně nebo trapně, nejsou univerzální samozřejmosti. Kulturní kód se zapisuje do svalového napětí dřív, než jej dokážeme vysvětlit slovy."
        ]
      },
      {
        title: "Mapa povoleného doteku kopíruje vztah",
        paragraphs: [
          "Studie Juulie Suvilehto a kolektivu nechala lidi vyznačit, kde by pro ně byl přijatelný dotek od různých osob v jejich sociální síti. Výsledné mapy se měnily podle emoční blízkosti: neexistovala jedna univerzální mapa těla platná pro každého člověka a každý vztah.",
          "Mezikulturní výzkum něžného partnerského doteku zároveň ukazuje, že objetí, hlazení a polibek se objevují napříč zeměmi, ale jejich frekvence a význam nejsou totožné. Biologická schopnost cítit tlak dlaně sama nevysvětluje, zda je gesto bezpečné, intimní, veřejné nebo zakázané."
        ],
        image: "/gallery/kresba-tvare.webp",
        imageAlt: "Kresba tváře rozložená do vrstev a stop"
      },
      {
        title: "Kulturní podmíněnost není argument proti hranici",
        paragraphs: [
          "Říct, že je stud naučený, neznamená získat právo jej druhému člověku rozbít. Kulturní kód není jen ideologie v hlavě; může být propojený s traumatem, senzorickou citlivostí, bolestí, bezpečím i sociálním rizikem. Změna má smysl pouze tehdy, když ji nese člověk, jehož těla se týká.",
          "Projekt proto nabízí experiment, ne převýchovu. Účastník může vyzkoušet gesto, které mu dřív připadalo nemožné, a může také zjistit, že jeho hranice je přesná a nechce ji posouvat. Obojí je poznání. Film nezachycuje vítězství nad studem, ale vztah mezi naučeným pravidlem, tělesnou reakcí a svobodným rozhodnutím."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Techniques of the Body", author: "Marcel Mauss · Economy and Society · 1935/1973", url: "https://www.tandfonline.com/doi/abs/10.1080/03085147300000003", note: "Klasická formulace společensky naučených způsobů používání těla." },
      { n: "02", title: "Topography of social touching depends on emotional bonds between humans", author: "Suvilehto et al. · PNAS · 2015", url: "https://www.pnas.org/doi/10.1073/pnas.1519231112", note: "Výzkum vztahu mezi emoční blízkostí a mapou přijatelného doteku na těle." },
      { n: "03", title: "Love and affectionate touch toward romantic partners all over the world", author: "Sorokowska et al. · Scientific Reports · 2023", url: "https://www.nature.com/articles/s41598-023-31502-1", note: "Dvě studie s celkem 7 880 účastníky, včetně mezikulturního šetření v 37 zemích." },
      { n: "04", title: "Techniques, Technology and Civilization", author: "Marcel Mauss · Berghahn Books", url: "https://www.berghahnbooks.com/title/MaussTechniques", note: "Vydavatelský záznam souboru Maussových textů včetně Techniques of the Body." }
    ]
  },
  {
    slug: "kdo-smi-tvorit",
    kicker: "Esej 06 · technoanarchismus a filmová práce",
    title: "Kdo smí tvořit, když nemá velký štáb?",
    dek: "Profesionalita není počet lidí u kamery. Je to čitelnost odpovědnosti. O punku, hecu, vzájemné pomoci a projektu, který nechce předstírat instituci, ale musí unést důsledky vlastní svobody.",
    date: "červenec 2026",
    cover: "/gallery/konstruktivisticka-vez.webp",
    coverAlt: "Ocelová konstrukce věže viděná zevnitř směrem vzhůru",
    thesis: "Demokratizace tvorby neznamená, že zkušenost přestala mít cenu. Znamená, že přístup ke kameře, distribuci a autorství nemá být výsadou instituce. Malý tým je legitimní tehdy, když neskrývá své limity, rozděluje odpovědnost a dovoluje lidem před kamerou skutečně spolurozhodovat.",
    sections: [
      {
        title: "„Profesionální“ je často popis moci, ne kvality",
        paragraphs: [
          "Obava, zda lze s intimním tématem pracovat bez velkého profesionálního týmu, je oprávněná. Špatná odpověď by zněla: stačí dobrý úmysl. Nestačí. Kamera vytváří moc, střih může změnit význam gesta a zveřejnění může člověku vstoupit do života způsobem, který autor už nevezme zpět. Zkušenost, koordinace, zvuk, produkce i psychologická citlivost jsou skutečné kompetence, ne buržoazní cetky.",
          "Jenže slovo profesionální zároveň často funguje jako vrátný. Smíchá dohromady placenou práci, technickou kvalitu, institucionální legitimitu, bezpečí i společenskou prestiž a pak předstírá, že kdo nemá peníze na celý aparát, nemá právo tvořit. Historie filmu takhle nevypadá. Amatérský, rodinný, experimentální, aktivistický i internetový film nevznikají jako nedokonalé čekárny před skutečným uměním. Jsou to svébytné audiovizuální světy s vlastními pravidly, znalostmi a způsoby distribuce.",
          "Profesionalitu proto chápu praktičtěji: jako schopnost pojmenovat, kdo za co odpovídá, co neumí, koho si k tomu přizve a kde se proces zastaví. Desetičlenný štáb bez skutečné možnosti říct ne může být nebezpečnější než tři lidé, kteří mají jasné hranice. Malý štáb není bezpečný automaticky; jeho výhodou je pouze menší sociální tlak a čitelnější vztah. To je možnost, ne alibi."
        ],
        image: "/gallery/brutalistni-okulus.webp",
        imageAlt: "Zelený kruhový průhled v temné brutalistní konstrukci"
      },
      {
        title: "Punk a hec nejsou omluva pro fušeřinu",
        paragraphs: [
          "Ve své magisterské práci Punk, hec a esence tvoření jsem sledoval přerovské filmaře, kteří se pohybovali mezi rodinnými záznamy, reklamou, televizí, nízkorozpočtovým hororem a autorským filmem. Jejich dráhy nebyly schodištěm od amatéra k profesionálovi. Spíš připomínaly síť cest: jednou člověk vydělával zakázkou, podruhé z hecu založil projekt, potřetí použil profesionální zkušenost k filmu, který by mu žádná instituce nezaplatila.",
          "Punk v tomto smyslu není rozmazaný obraz a špinavá bunda. Je to rozhodnutí nezačínat až ve chvíli, kdy systém vydá povolení. Hec je počáteční energie, která překoná paralýzu z nedostatku kapitálu, kontaktů a správného rodokmenu. Oba principy jsou užitečné jen tehdy, když se po prvním skoku promění v práci: rešerši, přípravu, testování, schopnost přijmout kritiku a ochotu zahodit záběr, který je krásný, ale vznikl špatně.",
          "DIY proto neznamená „všechno zvládnu sám“. Znamená „nebudu čekat na kompletní aparát, abych začal budovat vztahy a dovednosti“. Když je potřeba specializovaná kompetence, je součástí odpovědnosti ji přizvat. Když prostředky nestačí, rozsah filmu se musí zmenšit. Radikální skromnost je někdy profesionálnější než velká deklarace."
        ]
      },
      {
        title: "Digitální paradox: nástroje zlevnily, moc se soustředila",
        paragraphs: [
          "Digitální kamera, střižna v notebooku a online distribuce rozšířily okruh lidí, kteří mohou tvořit. Slibovaly semiotickou demokracii: divák se mohl stát autorem, lokální zkušenost mohla obejít vysílací radu a film už nepotřeboval laboratoř ani televizní frekvenci. Jenže demokratizace nástroje neznamenala demokratizaci infrastruktury. YouTube, Instagram a další platformy soustředily distribuci, data i pravidla viditelnosti do několika soukromých systémů.",
          "Tvůrce dnes může natočit film téměř zadarmo, ale jeho vztah s publikem prostředkuje černá skříňka. Algoritmus odměňuje předvídatelnost, frekvenci a udržení pozornosti; člověk se učí být zároveň autorem, produktem i neplaceným trenérem systému. Generativní AI tuto logiku posouvá dál: z existujících děl vytváří infrastrukturu pro levnější produkci a původní tvůrce může redukovat na operátora záměru, který soutěží s automatizovanou imitací vlastního řemesla.",
          "Technoanarchismus pro mě neznamená rozbít notebook kladivem. Znamená ptát se, kdo technologii vlastní, kdo určuje její pravidla a zda se uživatelé mohou podílet na správě. PeerTube, otevřený software nebo platformní družstva nejsou dokonalý digitální ráj. Ukazují však, že síť může být navržena jako federace, společný statek nebo kooperativa, ne pouze jako továrna na data."
        ]
      },
      {
        title: "Digitalizovaný mutualismus: technologie v rukou lidí",
        paragraphs: [
          "Kropotkinova vzájemná pomoc není sentimentální představa, že se všichni budeme mít rádi. Je to pozorování, že spolupráce je materiální strategie přežití. V audiovizi ji lze přeložit do sdílené techniky, otevřeného know-how, neformálního učení, společného hlídání rizik a distribučních cest, jejichž pravidla neurčuje investor mimo komunitu.",
          "Tento princip ve svém návrhu disertační práce nazývám digitalizovaným mutualismem. Jeho praktické minimum tvoří decentralizace, otevřenost nástrojů, ochrana soukromí a odolnost vůči jednomu vlastníkovi. Nestačí tedy dát lidem levnou kameru. Potřebují možnost rozhodovat o tom, kam se materiál ukládá, kdo jej smí analyzovat, jak se dělí výnos a jak lze obsah odstranit.",
          "Pro Husí kůži to znamená zachovat kontrolu nad kontextem a nesvěřit intimní obraz automaticky platformě, která ho buď smaže, nebo přeloží do pornografické kategorie. Vlastní web, menší projekce a schvalování každého způsobu uvedení nejsou distribuční nedostatek. Jsou pokusem udržet význam filmu mezi lidmi, kteří jej vytvořili."
        ]
      },
      {
        title: "Spoluautorství místo levného castingu",
        paragraphs: [
          "Projekt nechce po člověku před kamerou herecký výkon a neslibuje, že ho neplacená účast „někam posune“. To by byl stejný extraktivní model v přátelštějším fontu. V první nízkorozpočtové fázi není účast honorovaná, což je skutečný limit a pro mnoho lidí naprosto dostatečný důvod odmítnout. Neplacenost není důkaz čistoty ani test oddanosti umění.",
          "Smyslem participace má být spoluautorství konkrétního portrétu: možnost ovlivnit obraz, hlas, anonymitu, střih i použití. Pokud člověk hledá placenou hereckou práci nebo roli, která rozšíří jeho showreel, tento projekt mu pravděpodobně nic poctivého nabídnout neumí. Pokud později získá finance, práce se má platit; chudoba produkce se nesmí změnit v trvalou ideologii cizí práce zdarma.",
          "Malý tým tedy není manifest proti odbornosti. Je to dočasná produkční forma, která musí růst podle rizika, ne podle ega autora. Technoanarchistická tvorba nezačíná větou „autor může všechno“. Začíná větou „nikdo nemá mít monopol na tvorbu“ – a pokračuje otázkou, jak rozdělit moc, aby svoboda jednoho člověka nebyla účet vystavený ostatním."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Platform Cooperativism: Challenging the Corporate Sharing Economy", author: "Trebor Scholz · Rosa Luxemburg Stiftung · 2016", url: "https://rosalux.nyc/wp-content/uploads/2020/11/RLS-NYC_platformcoop.pdf", note: "Návrh digitálních platforem založených na demokratickém vlastnictví, spoluřízení a solidaritě." },
      { n: "02", title: "What is PeerTube?", author: "Framasoft · oficiální dokumentace projektu", url: "https://joinpeertube.org/", note: "Praktický příklad svobodné, federované a decentralizované infrastruktury pro video." },
      { n: "03", title: "Mutual Aid: A Factor of Evolution", author: "Petr Kropotkin · 1902", url: "https://www.gutenberg.org/ebooks/4341", note: "Klasické východisko vzájemné pomoci jako materiální strategie spolupráce." },
      { n: "04", title: "Platform Cooperativism Consortium", author: "The New School · platform.coop", url: "https://platform.coop/", note: "Současné příklady platforem vlastněných a řízených pracujícími a dalšími stakeholdery." }
    ]
  },
  {
    slug: "umeni-po-stroji",
    kicker: "Esej 07 · Umění hoven, AI a estetická neposlušnost",
    title: "Umění po stroji: proč hovna pořád nejsou prompt",
    dek: "Syntéza manifestu z roku 2022 a jeho pozdější participativní verze. Generativní systém umí napodobit špínu obrazu. Neumí ale převzít vztah, riziko a odpovědnost, z nichž obraz vznikl.",
    date: "červenec 2026",
    cover: "/gallery/organicka-hmota.webp",
    coverAlt: "Extrémní detail mokré tmavé organické hmoty",
    thesis: "Vzpoura proti generativní uniformitě nespočívá v soutěži, kdo vyrobí ošklivější obraz. Spočívá v přesunu hodnoty od bezchybného produktu k situaci: k tělu, vztahu, konfliktu, spoluautorství a následkům, které nelze stáhnout jako modelový checkpoint.",
    sections: [
      {
        title: "Manifest z doby před velkým generátorem",
        paragraphs: [
          "V roce 2022 jsem napsal text Umění hoven. Byl schválně přepjatý, vulgární a hegelovsky opilý vlastní důležitostí. Proti uhlazenému, účelnému a společensky poslušnému umění stavěl potrhaný film, rozmazanou fotografii, umaštěný papír, nonšalantní dialog a salvu mířenou nikoli pod sedadlo diváka, ale přímo do něj. Chtěl jsem antitezi k estetice, která se bojí zápachu, omylu a konfliktu.",
          "Dnes bych opravil jeho romantizaci destrukce i představu, že nepohodlí je automaticky pravdivé. Urážka může být stejně konvenční jako reklama a špatně zaostřený záběr není revoluce. Přesto v manifestu zůstala přesná intuice: umění ztrácí sílu, když se redukuje na bezchybný, snadno přenositelný a okamžitě hodnotitelný povrch.",
          "Pozdější krátká verze přidala participaci a větu „Technologia in manibus vulgi: Libertas“ – technologie v rukou lidu je svoboda. Tím se těžiště přesunulo. Nešlo už jen o estetickou vzpouru autora proti publiku, ale o možnost, že publikum, účastník a autor nejsou pevné kasty."
        ]
      },
      {
        title: "AI nevyrobila kýč. Jen ho automatizovala.",
        paragraphs: [
          "Generativní AI není první technologie, která proměňuje výrobu obrazů. Fotografie, syntetizátor, digitální střih i mobilní kamera rozložily starší monopoly dovednosti a zároveň vytvořily nové. Rozdíl je v měřítku a ekonomice: současné modely dokážou z obrovského množství existujících děl statisticky sestavit přesvědčivý obraz během sekund a nabídnout jej jako náhradu části placené kulturní práce.",
          "Problémem není, že stroj neumí vytvořit krásu. Umí vytvořit obraz, který lidé označí za kreativní nebo esteticky působivý. Experiment publikovaný v Science Advances dokonce ukázal, že přístup k nápadům generativní AI zvyšoval hodnocení jednotlivých povídek, zvlášť u méně kreativních autorů. Současně ale snižoval kolektivní rozmanitost výsledků. Jednotlivý produkt se může zlepšit, zatímco kulturní pole se začne podobat samo sobě.",
          "To je průmyslový sen: nekonečná variace bez skutečné odchylky, zdání novosti bez drahého života, z něhož novost obvykle vyrůstá. Kýč nebyl vynalezen neuronovou sítí. Síť jen dostala schopnost vyrábět kulturně pravděpodobný povrch rychlostí infrastruktury."
        ],
        image: "/gallery/umlcena-tvar.webp",
        imageAlt: "Černá kresba tváře s očima a ústy překrytými tmavými pásy"
      },
      {
        title: "Stroj může napodobit špínu",
        paragraphs: [
          "Pokud bychom Umění hoven chápali jako styl, generátor ho porazí do oběda. Stačí prompt na poškrábaný šestnáctimilimetrový film, zkaženou emulzi, tělesnou tekutinu, punkový zin a brutalistní typografii. Model vytvoří tisíc variant estetiky odporu a tržiště z nich udělá balíček filtrů. Každá historická avantgarda se nakonec může stát presetem.",
          "Proto nestačí být ošklivější, náhodnější ani vulgárnější než AI. Generativní systém se učí i z ošklivosti. Skutečná hranice neleží mezi krásným lidským a hnusným strojovým obrazem. Leží mezi výsledkem a událostí. Obraz může imitovat otisk vztahu, ale nebyl při něm. Nečekal, zda druhý člověk změní názor. Neriskoval ztrátu důvěry. Nemusel zastavit scénu a zahodit nejlepší materiál.",
          "Nástroje jako Glaze a Nightshade ukazují jednu podobu odporu: umělci mohou technicky narušovat nevyžádané napodobování stylu nebo trénování modelů. Je to důležitá obrana, ne konečné řešení. Hlubší spor se týká vlastnictví infrastruktury, práce a práva určit, zda se osobní tvorba stane surovinou pro cizí automatizaci."
        ]
      },
      {
        title: "Co tedy AI nenapodobí?",
        paragraphs: [
          "AI může napodobit viditelný povrch Husí kůže. Může vygenerovat pór, dech na skle, něžnou ruku i fotografii, která vypadá jako ztracená vzpomínka. Nemůže však být zpětně účastníkem konkrétní dohody mezi dvěma lidmi. Nemůže za člověka před kamerou určit jeho hranici a současně tvrdit, že jde o souhlas. Nemůže nést lidskou odpovědnost za následky zveřejnění.",
          "Toto není metafyzické prohlášení, že stroj nikdy nebude mít vědomí. Je to mnohem střízlivější produkční tvrzení. Hodnota dokumentárního portrétu není jen v pixelech, ale v indexu skutečného setkání: někdo tam byl, rozhodoval, reagoval a mohl odejít. I dokonale syntetický obraz může být uměním; není však záznamem vztahu, který se nestal.",
          "Právě proto americký Copyright Office i při debatě o generativní tvorbě rozlišuje lidské autorské příspěvky od pouhého zadání systému. Právní kategorie není filozofická pravda, ale potvrzuje praktický problém: prompt, výběr, editace, uspořádání a lidská práce nejsou jedna nerozlišená hmota."
        ]
      },
      {
        title: "Od salvy do diváka ke společné situaci",
        paragraphs: [
          "Původní manifest chtěl diváka zasáhnout. Dnes mě víc zajímá, jak z něj udělat spoluúčastníka bez toho, aby byl manipulovanou rekvizitou. Participace není interaktivní tlačítko ani marketingový trik. Znamená, že dílo přijímá zásah druhého člověka do vlastního tvaru a autor se vzdává části kontroly.",
          "Husí kůže je v tomto smyslu pokračováním Umění hoven méně doslovným, ale radikálnějším. Neoslavuje nedokonalost jako značku. Připouští, že hranice účastníka může zničit plán, že hlas může odporovat obrazu a že nejodvážnější rozhodnutí někdy spočívá v ničem explicitním. Forma nevzniká navzdory omezení; rodí se z vyjednávání s ním.",
          "Umění po stroji nemusí dokazovat lidskost chybou v expozici ani kultem rukodělnosti. Musí znovu ukázat, kde leží moc. Kdo dodal data? Kdo dostal zaplaceno? Kdo může stáhnout souhlas? Kdo nese následek? Kdo smí změnit pravidla? Hovno je stále užitečná metafora – ne jako textura, ale jako to, co systém vytěsňuje, protože se to špatně standardizuje, prodává a škáluje."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Generative AI enhances individual creativity but reduces the collective diversity of novel content", author: "Doshi & Hauser · Science Advances · 2024", url: "https://www.science.org/doi/10.1126/sciadv.adn5290", note: "Experiment o zvýšení hodnocení jednotlivých povídek a současném poklesu podobnosti či rozmanitosti souboru výsledků." },
      { n: "02", title: "Glaze: Protecting Artists from Style Mimicry by Text-to-Image Models", author: "Shan et al. · USENIX Security · 2023", url: "https://arxiv.org/abs/2302.04222", note: "Výzkum nástroje, který narušuje nevyžádanou imitaci osobního výtvarného stylu generativními modely." },
      { n: "03", title: "Copyright and Artificial Intelligence, Part 2: Copyrightability", author: "U.S. Copyright Office · 2025", url: "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf", note: "Oficiální rozbor rozlišující lidský autorský vklad, použití AI jako nástroje a čistě generované výstupy." },
      { n: "04", title: "Recommendation on the Ethics of Artificial Intelligence", author: "UNESCO · 2021", url: "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence", note: "Mezinárodní rámec zdůrazňující lidskou důstojnost, transparentnost, kulturní rozmanitost a účast tvůrců na zavádění AI." }
    ]
  },
  {
    slug: "odvaha-k-zranitelnosti",
    kicker: "Esej 08 · osobní manifest",
    title: "Odvaha k zranitelnosti",
    dek: "O senzorické obraně, třech letech izolace a cestě ven. Zranitelnost tu není veřejná nahota ani povinná otevřenost, ale možnost přestat hrát roli a přitom si ponechat hranice.",
    date: "červenec 2026",
    cover: "/gallery/lebka-srdce.webp",
    coverAlt: "Průsvitná lebka se srdcem a ručně vytvořenýma očima",
    thesis: "Zaťatá pěst dokáže přežít úder, ale nedokáže obejmout. Odvaha k zranitelnosti neznamená odhalit všechno. Znamená uvolnit obranu natolik, aby člověk mohl sám rozhodnout, koho a co pustí blíž.",
    sections: [
      {
        title: "Mrcasení v kebuláči",
        paragraphs: [
          "Dlouhá léta jsem ignoroval něco, čemu jsem říkal mrcasení v hlavě. Chlap nebrečí, nedává najevo slabost, zatne pěsti a světem se probije. Až v roce 2023 jsem začal svoje údajné neduhy opravdu řešit. Nejdřív přišla diagnóza ADHD, potom porucha autistického spektra. Nebyl to okamžitý návod k použití vlastního mozku. Spíš nové názvy pro konflikt, který už dávno probíhal.",
          "Tři roky jsem téměř neopouštěl byt. Existoval jsem v tabulkově přesných vzorcích, odmítal nepředvídatelnost a bál se situací, v nichž bych znovu musel nasadit masku své představy normálního smrtelníka. Samota má jednu podivnou výhodu: bez diváků je člověk autentický. Jenže autentický může být i strach, který si vybuduje dokonale funkční pevnost.",
          "Ve skladišti rekvizit, kostýmů a natáčecích aparátů jsem začal přemýšlet, co všechno nám bylo vzato – a kolik z toho jsme se naučili hlídat sami v sobě."
        ],
        image: "/gallery/jehelnice-lebka.webp",
        imageAlt: "Stylizovaná lebka s očima obklopenýma špendlíky"
      },
      {
        title: "Vyvlastnění neprobíhá jen v továrně",
        paragraphs: [
          "Vyvlastnili nám práci, která už nemá být radostí z tvorby ani užitečností, ale důkazem naší hodnoty. Vyvlastnili čas a rozdělili ho na produktivitu, prokrastinaci a odpočinek, který si musíme zasloužit. Domov se stal investicí pro vyvolené, pozornost komoditou, péče službou, vzdělání kvalifikací, přátelství kontakty, paměť datasetem, osobnost značkou a zkušenost contentem.",
          "Nevyvlastňují se jen věci, ale i jejich významy. Metanarativy vysvětlují, jak má vypadat úspěch, dospělost, rodina, zdraví i pokrok. Normy určují, které tělo je přijatelné, která mysl funkční a která emoce přiměřená. Viditelný dozorce není potřeba. Jeho hlas se naučíme používat sami proti sobě.",
          "Intimita je součást stejného procesu. Tělo má být upravené, výkonné, žádoucí a vhodné k posuzování. Emoce mají být racionální nebo alespoň obhajitelné. Blízkost se mění ve výkon, zboží a důkaz úspěchu – anebo v tabu, o němž je dovoleno mluvit pouze šeptem a správnými slovy."
        ]
      },
      {
        title: "Tělo si pamatuje obranu",
        paragraphs: [
          "Jako dítě jsem nesnesl dotek cizích lidí, některé odstíny barev, intenzivní světlo ani hluk. Nedokázal jsem se po někom napít, přijmout blahopřejný polibek, chytit se za ruce nebo se převlékat ve společné šatně. Donedávna pro mě bylo těžké mluvit o emocích bez ironie, spát s někým v jedné místnosti, obejmout dlouholeté přátele nebo se nechat vidět bez připravené role.",
          "Tyto hranice nebyly falešné jen proto, že část z nich vznikla učením, senzorickou citlivostí nebo úzkostí. Obrana je reálná tělesná práce. Problém nastává ve chvíli, kdy ji zaměníme za celou svou identitu a každou možnost změny začneme vnímat jako útok.",
          "Odvaha k zranitelnosti proto nesmí být slogan pro překračování cizího ne. Neříká: odhal se, dotkni se, vydrž nepohodlí. Ptá se: je tahle hranice moje, nebo jsem ji zdědil od strachu a očekávání? A pokud je moje, dokážu ji vyslovit tak, aby mě chránila, ale nezamkla?"
        ]
      },
      {
        title: "Rok 2026 jako reboot",
        paragraphs: [
          "Relativně nedávno jsem začal vnímat smrt s pokornějším respektem. Ne jako romantickou konečnou stanici, ale jako možnost, že se na tuhle planetu už nepodívám. Dostal jsem chuť vyždímat její příběhy a potenciál tak, jak mi moje tělo, syndromy a zdroje dovolí. Zvedl jsem se ze židle a šel ven.",
          "V březnu jsem odjel s člověkem, kterého jsem znal dvacet minut, na dvoutýdenní cestu po Fennoskandinávii. Mluvil jsem cizím jazykem, kterým pořádně nevládnu, a stali se z nás přátelé. V květnu jsem se po letech odkládání odstěhoval do Prahy a začal bez jistého zázemí hledat nové jistoty. V červenci jsem s dlouholetým kamarádem ušel přibližně 150 kilometrů na Králický Sněžník.",
          "Nejsou to vítězné medaile za porážku diagnóz. Strach nezmizel a já se nestal extrovertní reklamou na život naplno. Jen se ukázalo, že hranice mohou být pohyblivé, když o jejich pohybu rozhoduju já a když vedle mě stojí lidé, kteří ze změny neudělají test hodnoty."
        ]
      },
      {
        title: "Zaťatá pěst neobejme",
        paragraphs: [
          "Pěst je užitečný nástroj. Chrání měkké části ruky, soustředí sílu a dovoluje vzdorovat. Když ale zůstane sevřená pořád, přestane být reakcí a stane se tělesným režimem. Nevezme druhou ruku, nepohladí, nevytvoří oporu. Zaťatá pěst neobejme. Uvolni ji neznamená vzdej se. Znamená dovol ruce znovu volit.",
          "Husí kůže z této osobní zkušenosti vyrůstá, ale nechce ji vydávat za univerzální příběh uzdravení. Film má vytvořit situaci, v níž každý člověk hledá vlastní vztah mezi obranou a blízkostí. Někdo dovolí kameře jen dech a prsty přes látku. Někdo nahotu. Někdo hlas bez obrazu. Někdo po první schůzce odejde. Všechna tato rozhodnutí mohou být přesná.",
          "Odvaha se neměří množstvím odhalené kůže. Zranitelnost není obsah, který autor z druhého člověka vytěží. Je to možnost být přítomný bez dokonale připravené role a současně vědět, že stopka zůstává platná. Proto je pro projekt důležitější živé ne než krásné ano vynucené očekáváním."
        ]
      },
      {
        title: "Vzít si zpátky všechno to člověčí",
        paragraphs: [
          "Zajímá mě, co jsme přestali považovat za své a zda si to lze vzít zpátky. Práci, která dává smysl. Čas a volnost bez cenovky. Domov bez privilegia narození. Pozornost mimo trendy. Vzdělání bez potřeby vnějšího razítka. Paměť jako vlastní rekonstrukci minulosti. Identitu zbavenou binárních šablon.",
          "A také blízkost bez komodifikovaného scénáře. Intimitu beze studu a s vlastními hranicemi. Tělo, které nemusí být značkou ani důkazem výkonu. Film, který nevyrábí člověka pro pohled systému, ale nechává člověka spoluurčit, co vůbec bude vidět.",
          "Je to velká politická ambice schovaná v malém gestu. Ruka čeká. Druhá se rozhoduje, zda přijde blíž. Kamera není soudce ani tajný svědek. Je přítomná pouze tak dlouho, dokud vztah, který ji umožnil, stále trvá."
        ]
      }
    ],
    sources: [
      { n: "01", title: "Uses of the Erotic: The Erotic as Power", author: "Audre Lorde · Sister Outsider", url: "https://www.penguinrandomhouse.com/books/608235/sister-outsider-by-audre-lorde/", note: "Erotično jako schopnost rozpoznat vlastní plnost, radost, hranici a jednání, ne jako komodita pro cizí pohled." },
      { n: "02", title: "The Cultural Politics of Emotion", author: "Sara Ahmed · Edinburgh University Press", url: "https://edinburghuniversitypress.com/book-the-cultural-politics-of-emotion.html", note: "Emoce nejsou uzavřené soukromé objekty; obíhají mezi těly, normami, institucemi a politickými příběhy." },
      { n: "03", title: "Cold Intimacies", author: "Eva Illouz · Polity · 2007", url: "https://www.politybooks.com/bookdetail?book_slug=cold-intimacies-the-making-of-emotional-capitalism--9780745639048", note: "Rámec pro popis prorůstání ekonomického jazyka, sebehodnocení a trhu do intimních vztahů." },
      { n: "04", title: "Neurodiversity and the social ecology of mental functions", author: "Chapman · Perspectives on Psychological Science · 2021", url: "https://doi.org/10.1177/1745691620959833", note: "Neurodiverzita jako vztah mezi tělem, prostředím a sociálním uspořádáním, nikoli pouze individuální deficit." }
    ]
  }
];

export const essays: Essay[] = [
  ...builtInEssays,
  ...((siteContent as { customArticles?: Essay[] }).customArticles ?? []),
];

export function getEssay(slug: string) {
  return essays.find((essay) => essay.slug === slug);
}

export function getEssayWordCount(essay: Essay) {
  const text = [
    essay.title,
    essay.dek,
    essay.thesis,
    ...essay.sections.flatMap((section) => [section.title, ...section.paragraphs]),
  ].join(" ");

  return text.trim().split(/\s+/u).filter(Boolean).length;
}

export function getEssayReadingTime(essay: Essay, locale: Locale = "cs") {
  const minutes = Math.max(1, Math.ceil(getEssayWordCount(essay) / 210));
  if (locale === "en") return `${minutes} min read`;
  if (locale === "uk") return `${minutes} хв читання`;
  return `${minutes} min čtení`;
}
