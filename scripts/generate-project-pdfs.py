#!/usr/bin/env python3
from __future__ import annotations

from html import escape
from pathlib import Path
from shutil import copyfile
from typing import Any

from PIL import Image as PILImage
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads"
OUT.mkdir(parents=True, exist_ok=True)
IMAGE_CACHE = ROOT / "tmp" / "pdfs" / "image-cache"
IMAGE_CACHE.mkdir(parents=True, exist_ok=True)

W, H = A4
M = 21 * mm

PAPER = HexColor("#F5F1EA")
INK = HexColor("#111820")
PINK = HexColor("#ED2859")
ACID = HexColor("#C8FF18")
NAVY = HexColor("#0D304E")
WHITE = HexColor("#FFFFFF")
MUTED = HexColor("#5F646A")
LINE = HexColor("#C9C4BC")

pdfmetrics.registerFont(TTFont("HK", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("HK-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))


CONTENT: dict[str, dict[str, Any]] = {
    "cs": {
        "file": "husi-kuze-koncepce-cs.pdf",
        "title": "HUSÍ KŮŽE",
        "subtitle": "Filmové portréty doteku",
        "version": "Pracovní koncepce · verze 5.0 · červenec 2026",
        "cover_note": "Série krátkých dokumentárních portrétů o těle, blízkosti a o tom, co s tělem dělá důvěra.",
        "development": "Projekt je ve vývoji. Kontakt ani první schůzka nejsou souhlasem s natáčením. Série je pouze pro dospělé 18+.",
        "sections": [
            {
                "no": "01",
                "label": "O CO JDE",
                "title": "Tělo není materiál. Je to člověk, který rozhoduje o obrazu.",
                "lead": "Husí kůže propojuje samostatný hlas člověka s extrémním detailem kůže, dechu, látky a doteku. Tvář ani jméno nejsou podmínkou.",
                "body": [
                    "Každý krátký film patří jednomu člověku nebo lidem, kteří chtějí vstoupit do obrazu spolu. Přirozená délka portrétu je přibližně 3 až 6 minut; 10 minut je horní hranice, nikoli povinný formát.",
                    "Kamera se přibližuje tak těsně, že tělo často přestává být snadno čitelnou anatomií. Zůstávají póry, chloupky, otisk, tlak, dech, látka, světlo a drobná změna napětí. Obraz není přehlídkou těl, ale mapou toho, co s tělem dělá důvěra.",
                ],
                "quote": "Kdy je tělo v obraze ještě přítomným subjektem - a kdy už se mění v objekt pro cizí pohled?",
                "image": "gallery/sklenene-oko.webp",
            },
            {
                "no": "02",
                "label": "ROZSAH",
                "title": "Od běžného oblečení po nahotu. Není to žebřík.",
                "lead": "Portrét může zůstat úplně oblečený, pracovat pouze s hlasem nebo zachytit obyčejnou blízkost bez sexuálního významu. Otevřenější podoba je možnost, ne skrytý cíl.",
                "cards": [
                    ("01", "OBLEČENÍ", "Objetí, vlasy, dech, společné ležení nebo dotek přes látku."),
                    ("02", "ČÁSTEČNÉ ODHALENÍ", "Plavky nebo konkrétně domluvený výsek těla bez úplné nahoty."),
                    ("03", "NAHOTA", "Rovnocenná možnost pouze pro člověka, který ji sám opravdu chce."),
                    ("04", "NEJISTOTA", "Je v pořádku rozsah ještě nevědět, zmenšit ho nebo portrét odmítnout."),
                ],
                "quote": "Portrét není úplný tehdy, když dojde nejdál. Je úplný tehdy, když odpovídá člověku, který v něm je.",
                "image": "gallery/drevo-telo.webp",
            },
            {
                "no": "03",
                "label": "OBRAZ · HLAS · ZVUK",
                "title": "Tři rovnocenné vrstvy jednoho portrétu.",
                "lead": "Rozhovor nemusí popisovat právě viděné gesto. Mezi samostatným hlasem a tělesným obrazem vzniká třetí význam.",
                "columns": [
                    ("OBRAZ", "Detail kůže, pohybu, světla, stínu a materiálů. Styl vychází z konkrétního člověka a místa."),
                    ("HLAS", "Samostatný rozhovor v klidném tempu. Otázky lze dostat dopředu; hlas může zůstat původní, změněný nebo nahrazený titulky."),
                    ("ZVUK", "Dlaň po kůži, dech, polknutí, tření látky, bosý krok a ticho prostoru. Hudba je možnost, nikoli povel k emoci."),
                ],
                "body": [
                    "Anonymita je výrazový prostředek, ne kouzelný slib. Lze vynechat tvář a jméno, změnit hlas a nesnímat poznávací znaky. Úplné riziko rozpoznání ale nelze vyloučit: někdo může poznat tetování, pokoj, hlas nebo vyprávěnou událost. Konkrétní rizika se proto probírají předem.",
                ],
                "image": "gallery/kresba-vrstvy.webp",
            },
            {
                "no": "04",
                "label": "JAK PORTRÉT VZNIKÁ",
                "title": "Nejdřív člověk. Teprve potom obraz.",
                "lead": "První setkání probíhá bez kamery, bez svlékání a bez závazku. Jeho cílem není někoho přesvědčit, ale zjistit, zda společná práce dává smysl.",
                "steps": [
                    ("01", "SETKÁNÍ", "Očekávání, obavy, přístupnost, motivace a důvod, proč do portrétu vstoupit - nebo nevstoupit."),
                    ("02", "NÁVRH", "Obraz, hlas, místo, druh doteku, anonymita, přítomní lidé a přesný rozsah zveřejnění."),
                    ("03", "NATÁČENÍ", "Uzavřený prostor, průběžná domluva, možnost zastavit a žádná změna zadání potichu."),
                    ("04", "STŘIH", "Účastník vidí pracovní i finální verzi a rozhoduje o konkrétním použití výsledku."),
                ],
                "image": "gallery/levitujici-list.webp",
            },
            {
                "no": "05",
                "label": "BEZPEČÍ A SOUHLAS",
                "title": "Souhlas není podpis. Je to způsob práce.",
                "lead": "Jedno ano neplatí automaticky pro další dotek, jiný záběr, novou střihovou verzi ani jiné zveřejnění.",
                "bullets": [
                    "Série pracuje výhradně s dospělými lidmi 18+.",
                    "Natáčí se střízlivě a v uzavřeném prostoru podle potřeb účastníků.",
                    "Předem se bez eufemismů pojmenuje obraz, dotek, případná nahota, zvuk, anonymita i zamýšlené použití.",
                    "Každý může přivést důvěryhodnou osobu a domluvit si stop slovo nebo gesto.",
                    "Nový nápad se nejdřív vysloví. Pokračuje se pouze po srozumitelném a dobrovolném souhlasu všech.",
                    "Před zveřejněním lze vyřadit konkrétní záběr, změnit anonymizaci nebo zastavit celou verzi.",
                    "Nové použití citlivého materiálu znamená nový dialog a nové schválení.",
                    "Záznam zůstává offline na šifrovaném úložišti s omezeným přístupem.",
                ],
                "note": "Po veřejném uvedení už internet neumí spolehlivě vrátit všechny kopie. Dosah a riziko se proto řeší ještě nad hotovým střihem - ne až po zveřejnění.",
                "image": "gallery/cerveny-signal-optimized.webp",
            },
            {
                "no": "06",
                "label": "KDO MŮŽE VSTOUPIT",
                "title": "Všechna dospělá těla nesou čas, zkušenost a vlastní hranice.",
                "lead": "Série je otevřená dospělým lidem bez ohledu na gender, věk, tělo, orientaci nebo vztahové uspořádání.",
                "body": [
                    "Někdo přijde sám, někdo s partnerem, kamarádem, blízkou osobou nebo skupinou. Blízkost může být milenecká, přátelská, pečující, komunitní, polyamorní, hravá nebo těžko pojmenovatelná. Nikdo není rekvizitou pro cizí portrét.",
                    "Projekt nehledá idealizovaná reklamní těla. Zajímají ho jizvy, chloupky, vrásky, únava, rozpačitost, slast, humor i obyčejná přítomnost. Účast není herecká role ani náhrada placené práce.",
                    "Přístupnost se řeší konkrétně: klidné nebo bezbariérové místo, otázky předem, více času, důvěryhodný doprovod, online první rozhovor nebo jiná potřebná úprava.",
                ],
                "quote": "Ne, nejistota i ticho jsou platné odpovědi. Odmítnutí není problém k vyřešení.",
                "image": "gallery/umlcena-tvar.webp",
            },
            {
                "no": "07",
                "label": "PROČ",
                "title": "Těla jsou všude. Možnost žít v nich ale není rozdělená rovnoměrně.",
                "lead": "Reklama nabízí tělo jako nekonečný projekt, platformy třídí přitažlivost do shod a dosahu a intimita se snadno mění v měřitelný výkon.",
                "body": [
                    "Husí kůže nechce předstírat návrat do nevinného světa před internetem. Hledá malý prostor, v němž člověk není profil, zboží ani materiál k vytěžení, ale spoluautor významu vlastního těla.",
                    "Odvaha k zranitelnosti není povinnost odhalit všechno. Je to právo rozhodnout, co ze sebe ukážu, komu, kdy, v jakém jazyce a s jakým dosahem. Projekt proto nespojuje svobodu s absencí pravidel, ale s pravidly, která jsou srozumitelná, společná a dají se vědomě měnit.",
                ],
                "quote": "Viditelnost není totéž co možnost rozhodovat. Pozornost není totéž co blízkost.",
                "image": "gallery/zlata-mriz.webp",
            },
            {
                "no": "08",
                "label": "CO VZNIKNE",
                "title": "Nejdřív přesný krátký film. Potom případně větší plán.",
                "lead": "První fáze počítá s několika samostatnými portréty. První z nich vznikají také pro přijímací portfolio na dokumentární, filmové a multimediální školy.",
                "body": [
                    "Do portfolia, webu, projekce, galerie, výstavy, sociální sítě nebo festivalu se dostanou pouze konkrétně schválené záběry a verze. Souhlas s jedním filmem neznamená automatický souhlas se všemi budoucími montážemi.",
                    "Projekt vzniká komorně, s dostupnou technikou, vypůjčenými místy a malým týmem. Malý rozpočet není omluva pro nejasná pravidla. Čím citlivější situace, tím přesnější musí být příprava a tím menší bude rozsah, pokud na něj kapacita nestačí.",
                    "V první fázi není účast honorovaná. Pokud projekt získá finance, práce se má platit. Dobrovolná podpora nejdřív pokrývá prokazatelné náklady projektu; případný přebytek nebude osobním ziskem autora a bude věnován tematicky souvisejícím organizacím a dobročinným aktivitám.",
                ],
                "image": "gallery/zimni-les.webp",
            },
            {
                "no": "09",
                "label": "AUTOR",
                "title": "Štěpán Chalupa",
                "lead": "Filmař, režisér, fotograf a autor videoesejí. Absolvent magisterské filmové vědy na Masarykově univerzitě.",
                "body": [
                    "Režíroval vzdělávací formát What The Fact? pro Českou televizi, pracoval v Divadle FESTE a pod jménem Fellean tvoří videoeseje, satirické formáty, fotografie a dokumentární cestovní deníky.",
                    "Je neurodivergentní a senzoricky citlivý. Husí kůže proto nevzniká z bezpečné vzdálenosti: autor do obrazu vstupuje i vlastním tělem a zkoumá, zda lze ukázat zranitelnost, aniž by člověk přišel o své hranice.",
                ],
                "contact_title": "NEZÁVAZNÝ PRVNÍ KROK",
                "contact": [
                    "První schůzka je bez kamery, bez závazku a bez přesvědčování.",
                    "stepanchalupa@post.cz",
                    "+420 728 568 913",
                    "husi-kuze.fellean.chatgpt.site",
                ],
                "image": "gallery/prudky-potok-explicitni-optimized.webp",
            },
            {
                "no": "10",
                "label": "VÝCHODISKA A STANDARDY",
                "title": "Projekt stojí na výzkumu, kritickém obrazu a praktických pravidlech.",
                "lead": "Vybrané zdroje nejsou razítkem bezpečnosti. Pomáhají formulovat otázky a převádět etiku do konkrétního pracovního rámce.",
                "sources": [
                    "Laura U. Marks: The Skin of the Film. Duke University Press, 2000.",
                    "Eva Illouz: Cold Intimacies. Polity Press, 2007.",
                    "Audre Lorde: Uses of the Erotic: The Erotic as Power, 1978.",
                    "Marcel Mauss: Les techniques du corps, 1934.",
                    "Taina Bucher: If...Then: Algorithmic Power and Politics. Oxford University Press, 2018.",
                    "SAG-AFTRA: Standards and Protocols for the Use of Intimacy Coordinators.",
                    "Bectu / Equity: Guidance for Shooting Intimacy, 2022.",
                    "von Mohr et al.: Social touch deprivation during COVID-19. Royal Society Open Science, 2021.",
                ],
                "note": "Plná bibliografie, autorské eseje a přímé odkazy jsou na webu projektu.",
                "image": "gallery/brutalistni-okulus.webp",
            },
        ],
    },
    "en": {
        "file": "goosebumps-project-concept-en.pdf",
        "title": "GOOSEBUMPS",
        "subtitle": "Film portraits of touch",
        "version": "Working concept · version 5.0 · July 2026",
        "cover_note": "A series of short documentary portraits about the body, closeness and what trust does to the body.",
        "development": "This project is in development. Contact or a first meeting is not consent to filming. The series is for adults aged 18+ only.",
        "sections": [
            {
                "no": "01", "label": "THE PROJECT",
                "title": "A body is not material. It is a person who decides how they are seen.",
                "lead": "Goosebumps brings together a person's independent voice and extreme close-ups of skin, breath, fabric and touch. A face and a name are not required.",
                "body": [
                    "Each short film belongs to one person, or to people who choose to enter the image together. A portrait will usually run for about 3 to 6 minutes; 10 minutes is an upper limit, not a mandatory format.",
                    "The camera moves so close that the body often stops reading as obvious anatomy. What remains is pores, hair, pressure, breath, fabric, light and a small change in tension. The image is not a parade of bodies, but a map of what trust does to the body.",
                ],
                "quote": "When does a body remain a present, acting subject - and when does it become an object for someone else's gaze?",
                "image": "gallery/sklenene-oko.webp",
            },
            {
                "no": "02", "label": "SCOPE",
                "title": "From everyday clothing to nudity. This is not a ladder.",
                "lead": "A portrait may remain fully dressed, work only with voice, or show ordinary closeness without sexual meaning. A more revealing form is an option, never a hidden goal.",
                "cards": [
                    ("01", "FULLY DRESSED", "An embrace, hair, breath, lying together or touch through fabric."),
                    ("02", "PARTIAL EXPOSURE", "Swimwear or a specifically agreed part of the body without full nudity."),
                    ("03", "NUDITY", "An equal option only for a person who genuinely wants it."),
                    ("04", "UNCERTAINTY", "It is fine not to know yet, to reduce the scope or to refuse the portrait."),
                ],
                "quote": "A portrait is not complete because it goes furthest. It is complete when it is true to the person inside it.",
                "image": "gallery/drevo-telo.webp",
            },
            {
                "no": "03", "label": "IMAGE · VOICE · SOUND",
                "title": "Three equal layers of one portrait.",
                "lead": "The interview does not have to explain the gesture on screen. A third meaning emerges between an independent voice and a bodily image.",
                "columns": [
                    ("IMAGE", "Close detail of skin, movement, light, shadow and material. The style grows from the particular person and place."),
                    ("VOICE", "A separate interview at a calm pace. Questions can be shared in advance; the voice may remain original, be altered or be replaced by subtitles."),
                    ("SOUND", "A hand on skin, breath, swallowing, rubbing fabric, a bare foot and the room's silence. Music is an option, not an instruction to feel."),
                ],
                "body": [
                    "Anonymity is an expressive tool, not a magical promise. A face and name can be omitted, the voice can be altered and identifying details can be kept out of frame. Zero risk of recognition cannot be guaranteed: someone may recognise a tattoo, a room, a voice or a story. Specific risks are therefore discussed in advance.",
                ],
                "image": "gallery/kresba-vrstvy.webp",
            },
            {
                "no": "04", "label": "HOW A PORTRAIT IS MADE",
                "title": "The person comes first. The image comes second.",
                "lead": "The first meeting takes place without a camera, without undressing and without obligation. Its purpose is not persuasion, but to find out whether working together makes sense.",
                "steps": [
                    ("01", "MEETING", "Expectations, concerns, accessibility, motivation and the reason to enter the portrait - or not to."),
                    ("02", "PROPOSAL", "Image, voice, place, kind of touch, anonymity, people present and the exact scope of release."),
                    ("03", "FILMING", "A closed space, ongoing check-ins, the right to stop and no silent change of plan."),
                    ("04", "EDIT", "The participant sees the working and final cut and decides on each specific use."),
                ],
                "image": "gallery/levitujici-list.webp",
            },
            {
                "no": "05", "label": "SAFETY AND CONSENT",
                "title": "Consent is not a signature. It is a way of working.",
                "lead": "One yes does not automatically apply to another touch, a different shot, a new edit or another release.",
                "bullets": [
                    "The series works exclusively with adults aged 18+.",
                    "Filming is sober and takes place in a closed space shaped around participants' needs.",
                    "The image, touch, possible nudity, sound, anonymity and intended use are named clearly and without euphemisms.",
                    "Anyone may bring a trusted person and agree on a stop word or gesture.",
                    "A new idea is spoken aloud first. Work continues only after everyone understands and freely agrees.",
                    "Before release, a shot may be removed, anonymity changed or the entire version stopped.",
                    "A new use of sensitive material requires a new conversation and new approval.",
                    "Recorded material stays offline on encrypted storage with restricted access.",
                ],
                "note": "Once a work is public, the internet cannot reliably return every copy. Reach and risk are therefore discussed over the finished cut - before release, not after it.",
                "image": "gallery/cerveny-signal-optimized.webp",
            },
            {
                "no": "06", "label": "WHO CAN TAKE PART",
                "title": "Every adult body carries time, experience and its own boundaries.",
                "lead": "The series is open to adults regardless of gender, age, body, orientation or relationship structure.",
                "body": [
                    "Someone may come alone, with a partner, friend, close person or group. Closeness may be romantic, friendly, caring, communal, polyamorous, playful or difficult to name. Nobody is a prop in someone else's portrait.",
                    "The project is not looking for ideal advertising bodies. It is interested in scars, hair, wrinkles, fatigue, awkwardness, pleasure, humour and ordinary presence. Participation is not an acting role or a substitute for paid work.",
                    "Accessibility is discussed concretely: a quiet or accessible venue, questions in advance, more time, a trusted companion, an online first conversation or another needed adjustment.",
                ],
                "quote": "No, uncertainty and silence are valid answers. Refusal is not a problem to be solved.",
                "image": "gallery/umlcena-tvar.webp",
            },
            {
                "no": "07", "label": "WHY",
                "title": "Bodies are everywhere. The ability to live in them is not equally distributed.",
                "lead": "Advertising presents the body as an endless project, platforms sort attraction into matches and reach, and intimacy can easily become measurable performance.",
                "body": [
                    "Goosebumps does not pretend that we can return to an innocent world before the internet. It looks for a small space in which a person is not a profile, commodity or extractable resource, but a co-author of the meaning of their own body.",
                    "The courage to be vulnerable is not a duty to reveal everything. It is the right to decide what I show, to whom, when, in what language and with what reach. Freedom here does not mean the absence of rules, but rules that are clear, shared and consciously changeable.",
                ],
                "quote": "Visibility is not the same as agency. Attention is not the same as closeness.",
                "image": "gallery/zlata-mriz.webp",
            },
            {
                "no": "08", "label": "WHAT WILL BE MADE",
                "title": "First, a precise short film. A larger plan may follow.",
                "lead": "The first phase will produce several individual portraits. The first films are also being made for applications to documentary, film and multimedia schools.",
                "body": [
                    "Only specifically approved shots and versions may enter the portfolio, website, screening, gallery, exhibition, social platform or festival. Consent to one film is not automatic consent to every future montage.",
                    "The project is made on a small scale, with available equipment, borrowed locations and a small team. A low budget is no excuse for unclear rules. The more sensitive the situation, the more exact the preparation must be - and the scope will be reduced when capacity is insufficient.",
                    "Participation is unpaid in the first phase. If the project obtains funding, work should be paid. Voluntary support first covers documented project costs; any surplus will not become the author's personal profit and will be donated to relevant organisations and charitable activities.",
                ],
                "image": "gallery/zimni-les.webp",
            },
            {
                "no": "09", "label": "AUTHOR",
                "title": "Štěpán Chalupa",
                "lead": "Filmmaker, director, photographer and video essayist. He holds a master's degree in Film Studies from Masaryk University.",
                "body": [
                    "He directed the educational format What The Fact? for Czech Television, worked at Divadlo FESTE and creates video essays, satirical formats, photography and documentary travel diaries under the name Fellean.",
                    "He is neurodivergent and sensory-sensitive. Goosebumps is therefore not made from a safe distance: the author enters the image with his own body and asks whether vulnerability can be shown without losing one's boundaries.",
                ],
                "contact_title": "A NON-BINDING FIRST STEP",
                "contact": [
                    "The first meeting is without a camera, without obligation and without persuasion.",
                    "stepanchalupa@post.cz",
                    "+420 728 568 913",
                    "husi-kuze.fellean.chatgpt.site",
                ],
                "image": "gallery/prudky-potok-explicitni-optimized.webp",
            },
            {
                "no": "10", "label": "REFERENCES AND STANDARDS",
                "title": "The project is grounded in research, critical image-making and practical rules.",
                "lead": "These sources are not a safety certificate. They help formulate the questions and translate ethics into a concrete working framework.",
                "sources": [
                    "Laura U. Marks: The Skin of the Film. Duke University Press, 2000.",
                    "Eva Illouz: Cold Intimacies. Polity Press, 2007.",
                    "Audre Lorde: Uses of the Erotic: The Erotic as Power, 1978.",
                    "Marcel Mauss: Les techniques du corps, 1934.",
                    "Taina Bucher: If...Then: Algorithmic Power and Politics. Oxford University Press, 2018.",
                    "SAG-AFTRA: Standards and Protocols for the Use of Intimacy Coordinators.",
                    "Bectu / Equity: Guidance for Shooting Intimacy, 2022.",
                    "von Mohr et al.: Social touch deprivation during COVID-19. Royal Society Open Science, 2021.",
                ],
                "note": "The full bibliography, original essays and direct links are available on the project website.",
                "image": "gallery/brutalistni-okulus.webp",
            },
        ],
    },
    "uk": {
        "file": "husyacha-shkira-kontseptsiya-uk.pdf",
        "title": "ГУСЯЧА ШКІРА",
        "subtitle": "Кінопортрети дотику",
        "version": "Робоча концепція · версія 5.0 · липень 2026",
        "cover_note": "Серія коротких документальних портретів про тіло, близькість і те, як довіра змінює тіло.",
        "development": "Проєкт перебуває в розробці. Звернення або перша зустріч не є згодою на зйомку. Серія призначена лише для повнолітніх 18+.",
        "sections": [
            {
                "no": "01", "label": "ПРО ПРОЄКТ",
                "title": "Тіло - не матеріал. Це людина, яка вирішує, як її показувати.",
                "lead": "«Гусяча шкіра» поєднує самостійний голос людини з надзвичайно крупними планами шкіри, дихання, тканини й дотику. Обличчя та ім'я не є обов'язковими.",
                "body": [
                    "Кожен короткий фільм належить одній людині або людям, які хочуть разом увійти в кадр. Звична тривалість портрета - приблизно 3-6 хвилин; 10 хвилин є верхньою межею, а не обов'язковим форматом.",
                    "Камера наближається настільки, що тіло часто перестає сприйматися як очевидна анатомія. Залишаються пори, волоски, тиск, дихання, тканина, світло й невелика зміна напруження. Це не парад тіл, а карта того, як довіра змінює тіло.",
                ],
                "quote": "Коли тіло в кадрі залишається присутнім і дієвим суб'єктом - а коли стає об'єктом для чужого погляду?",
                "image": "gallery/sklenene-oko.webp",
            },
            {
                "no": "02", "label": "МЕЖІ",
                "title": "Від повсякденного одягу до оголення. Це не драбина.",
                "lead": "Портрет може залишатися повністю в одязі, працювати лише з голосом або показувати звичайну близькість без сексуального значення. Відкритіша форма є можливістю, а не прихованою метою.",
                "cards": [
                    ("01", "ОДЯГ", "Обійми, волосся, дихання, лежання поруч або дотик крізь тканину."),
                    ("02", "ЧАСТКОВЕ ОГОЛЕННЯ", "Купальник або конкретно узгоджена частина тіла без повного оголення."),
                    ("03", "ОГОЛЕННЯ", "Рівноцінна можливість лише для людини, яка справді цього хоче."),
                    ("04", "НЕПЕВНІСТЬ", "Можна ще не знати, зменшити межі або відмовитися від портрета."),
                ],
                "quote": "Портрет є повним не тому, що заходить найдалі. Він є повним, коли відповідає людині всередині нього.",
                "image": "gallery/drevo-telo.webp",
            },
            {
                "no": "03", "label": "ЗОБРАЖЕННЯ · ГОЛОС · ЗВУК",
                "title": "Три рівноцінні шари одного портрета.",
                "lead": "Інтерв'ю не мусить пояснювати жест у кадрі. Між самостійним голосом і тілесним зображенням виникає третій сенс.",
                "columns": [
                    ("ЗОБРАЖЕННЯ", "Деталь шкіри, руху, світла, тіні й матеріалу. Стиль виростає з конкретної людини та місця."),
                    ("ГОЛОС", "Окреме інтерв'ю у спокійному темпі. Питання можна отримати заздалегідь; голос може залишитися оригінальним, бути зміненим або заміненим субтитрами."),
                    ("ЗВУК", "Долоня на шкірі, дихання, ковтання, тертя тканини, босий крок і тиша кімнати. Музика є можливістю, а не наказом щось відчувати."),
                ],
                "body": [
                    "Анонімність є виражальним засобом, а не магічною обіцянкою. Обличчя та ім'я можна не показувати, голос - змінити, а впізнавані деталі - не знімати. Нульовий ризик упізнання гарантувати неможливо: хтось може впізнати татуювання, кімнату, голос або історію. Тому конкретні ризики обговорюються заздалегідь.",
                ],
                "image": "gallery/kresba-vrstvy.webp",
            },
            {
                "no": "04", "label": "ЯК СТВОРЮЄТЬСЯ ПОРТРЕТ",
                "title": "Спочатку людина. Потім зображення.",
                "lead": "Перша зустріч відбувається без камери, без роздягання й без зобов'язань. Її мета - не переконати, а зрозуміти, чи має спільна робота сенс.",
                "steps": [
                    ("01", "ЗУСТРІЧ", "Очікування, побоювання, доступність, мотивація та причина увійти в портрет - або не входити."),
                    ("02", "ПРОПОЗИЦІЯ", "Зображення, голос, місце, вид дотику, анонімність, присутні люди й точні межі публікації."),
                    ("03", "ЗЙОМКА", "Закритий простір, постійне узгодження, право зупинити процес і жодної мовчазної зміни плану."),
                    ("04", "МОНТАЖ", "Учасник бачить робочу й фінальну версії та вирішує щодо кожного конкретного використання."),
                ],
                "image": "gallery/levitujici-list.webp",
            },
            {
                "no": "05", "label": "БЕЗПЕКА І ЗГОДА",
                "title": "Згода - не підпис. Це спосіб роботи.",
                "lead": "Одне «так» не поширюється автоматично на інший дотик, інший кадр, новий монтаж або іншу публікацію.",
                "bullets": [
                    "Серія працює виключно з повнолітніми людьми 18+.",
                    "Зйомка відбувається тверезо й у закритому просторі, пристосованому до потреб учасників.",
                    "Зображення, дотик, можливе оголення, звук, анонімність і заплановане використання називаються прямо й без евфемізмів.",
                    "Кожен може привести довірену людину та домовитися про стоп-слово або жест.",
                    "Нову ідею спочатку озвучують. Робота триває лише після зрозумілої та добровільної згоди всіх.",
                    "До публікації можна вилучити кадр, змінити анонімізацію або зупинити всю версію.",
                    "Нове використання чутливого матеріалу потребує нової розмови й нового погодження.",
                    "Запис зберігається офлайн на зашифрованому носії з обмеженим доступом.",
                ],
                "note": "Після публікації інтернет не може надійно повернути всі копії. Тому охоплення й ризики обговорюються над готовим монтажем - до публікації, а не після неї.",
                "image": "gallery/cerveny-signal-optimized.webp",
            },
            {
                "no": "06", "label": "ХТО МОЖЕ ДОЛУЧИТИСЯ",
                "title": "Кожне доросле тіло несе час, досвід і власні межі.",
                "lead": "Серія відкрита для повнолітніх незалежно від гендеру, віку, тіла, орієнтації чи формату стосунків.",
                "body": [
                    "Хтось може прийти сам, з партнером, другом, близькою людиною або групою. Близькість може бути романтичною, дружньою, турботливою, спільнотною, поліаморною, грайливою або важкою для означення. Ніхто не є реквізитом у чужому портреті.",
                    "Проєкт не шукає ідеальних рекламних тіл. Його цікавлять шрами, волосся, зморшки, втома, ніяковість, насолода, гумор і звичайна присутність. Участь не є акторською роллю або заміною оплачуваної роботи.",
                    "Доступність обговорюється конкретно: тихе або безбар'єрне місце, питання заздалегідь, більше часу, довірений супровід, перша онлайн-розмова чи інше потрібне пристосування.",
                ],
                "quote": "«Ні», непевність і мовчання є чинними відповідями. Відмова - не проблема, яку треба виправити.",
                "image": "gallery/umlcena-tvar.webp",
            },
            {
                "no": "07", "label": "НАВІЩО",
                "title": "Тіла всюди. Але можливість жити у власному тілі розподілена нерівномірно.",
                "lead": "Реклама подає тіло як нескінченний проєкт, платформи сортують привабливість у збіги й охоплення, а інтимність легко стає вимірюваною продуктивністю.",
                "body": [
                    "«Гусяча шкіра» не вдає, що можна повернутися в невинний світ до інтернету. Вона шукає малий простір, де людина є не профілем, товаром або ресурсом для видобування, а співавтором значення власного тіла.",
                    "Сміливість бути вразливим - не обов'язок показати все. Це право вирішувати, що я показую, кому, коли, якою мовою і з яким охопленням. Свобода тут означає не відсутність правил, а правила, що є зрозумілими, спільними й свідомо змінюваними.",
                ],
                "quote": "Видимість - не те саме, що право вирішувати. Увага - не те саме, що близькість.",
                "image": "gallery/zlata-mriz.webp",
            },
            {
                "no": "08", "label": "ЩО БУДЕ СТВОРЕНО",
                "title": "Спочатку точний короткий фільм. Більший план може з'явитися пізніше.",
                "lead": "На першому етапі буде створено кілька окремих портретів. Перші фільми також готуються для вступного портфоліо до документальних, кінематографічних і мультимедійних шкіл.",
                "body": [
                    "До портфоліо, сайту, показу, галереї, виставки, соціальної мережі або фестивалю можуть увійти лише конкретно погоджені кадри й версії. Згода на один фільм не означає автоматичної згоди на всі майбутні монтажі.",
                    "Проєкт створюється камерно, з доступною технікою, позиченими локаціями й малою командою. Низький бюджет не виправдовує нечітких правил. Що чутливіша ситуація, то точнішою має бути підготовка; якщо спроможності недостатньо, масштаб зменшується.",
                    "На першому етапі участь не оплачується. Якщо проєкт отримає фінансування, робота має оплачуватися. Добровільна підтримка спочатку покриває підтверджені витрати проєкту; можливий надлишок не стане особистим прибутком автора й буде переданий дотичним організаціям і благодійним ініціативам.",
                ],
                "image": "gallery/zimni-les.webp",
            },
            {
                "no": "09", "label": "АВТОР",
                "title": "Štěpán Chalupa",
                "lead": "Кінематографіст, режисер, фотограф і автор відеоесеїв. Має магістерський ступінь із кінознавства Університету Масарика.",
                "body": [
                    "Режисував освітній формат What The Fact? для Чеського телебачення, працював у театрі FESTE й під ім'ям Fellean створює відеоесеї, сатиричні формати, фотографії та документальні щоденники подорожей.",
                    "Він нейровідмінний і сенсорно чутливий. Тому «Гусяча шкіра» не створюється з безпечної дистанції: автор входить у кадр власним тілом і запитує, чи можна показати вразливість, не втрачаючи власних меж.",
                ],
                "contact_title": "НЕЗОБОВ'ЯЗУВАЛЬНИЙ ПЕРШИЙ КРОК",
                "contact": [
                    "Перша зустріч відбувається без камери, без зобов'язань і без переконування.",
                    "stepanchalupa@post.cz",
                    "+420 728 568 913",
                    "husi-kuze.fellean.chatgpt.site",
                ],
                "image": "gallery/prudky-potok-explicitni-optimized.webp",
            },
            {
                "no": "10", "label": "ДЖЕРЕЛА І СТАНДАРТИ",
                "title": "Проєкт спирається на дослідження, критичну роботу із зображенням і практичні правила.",
                "lead": "Ці джерела не є сертифікатом безпеки. Вони допомагають формулювати питання й переводити етику в конкретну робочу рамку.",
                "sources": [
                    "Laura U. Marks: The Skin of the Film. Duke University Press, 2000.",
                    "Eva Illouz: Cold Intimacies. Polity Press, 2007.",
                    "Audre Lorde: Uses of the Erotic: The Erotic as Power, 1978.",
                    "Marcel Mauss: Les techniques du corps, 1934.",
                    "Taina Bucher: If...Then: Algorithmic Power and Politics. Oxford University Press, 2018.",
                    "SAG-AFTRA: Standards and Protocols for the Use of Intimacy Coordinators.",
                    "Bectu / Equity: Guidance for Shooting Intimacy, 2022.",
                    "von Mohr et al.: Social touch deprivation during COVID-19. Royal Society Open Science, 2021.",
                ],
                "note": "Повна бібліографія, авторські есеї та прямі посилання доступні на сайті проєкту.",
                "image": "gallery/brutalistni-okulus.webp",
            },
        ],
    },
}


def style(size: float, leading: float | None = None, color=INK, bold=False, tracking=0) -> ParagraphStyle:
    return ParagraphStyle(
        name=f"s-{size}-{leading}-{bold}-{tracking}",
        fontName="HK-Bold" if bold else "HK",
        fontSize=size,
        leading=leading or size * 1.35,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=0,
        spaceBefore=0,
        allowWidows=0,
        allowOrphans=0,
        splitLongWords=False,
        wordWrap="LTR",
        textTransform=None,
        letterSpacing=tracking,
    )


STYLES = {
    "label": style(9.5, 12, PINK, True, 0.4),
    "title": style(26, 30, INK, True),
    "lead": style(13.2, 18.2, NAVY, True),
    "body": style(10.5, 15.2, INK),
    "small": style(8.6, 12.4, MUTED),
    "quote": style(17, 22, WHITE, True),
    "card_title": style(10.2, 13.3, INK, True),
    "card_body": style(9.1, 12.6, INK),
    "contact": style(10.2, 15, WHITE, True),
}


def para(c: canvas.Canvas, text: str, st: ParagraphStyle, x: float, top: float, width: float) -> float:
    p = Paragraph(escape(text).replace("\n", "<br/>"), st)
    _, h = p.wrap(width, H)
    p.drawOn(c, x, top - h)
    return top - h


def crop_image(c: canvas.Canvas, rel_path: str, x: float, y: float, w: float, h: float, opacity=1.0) -> None:
    source = ROOT / "public" / rel_path
    cache_name = f"{source.stem}-pdf.jpg"
    path = IMAGE_CACHE / cache_name
    if not path.exists() or path.stat().st_mtime < source.stat().st_mtime:
        with PILImage.open(source) as im:
            prepared = im.convert("RGB")
            prepared.thumbnail((1600, 1600), PILImage.Resampling.LANCZOS)
            prepared.save(path, "JPEG", quality=78, optimize=True, progressive=True)
    with PILImage.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx, dy = x + (w - dw) / 2, y + (h - dh) / 2
    c.saveState()
    c.setFillAlpha(opacity)
    clip = c.beginPath()
    clip.rect(x, y, w, h)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(str(path), dx, dy, dw, dh, preserveAspectRatio=True, mask="auto")
    c.restoreState()


def page_base(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(PINK)
    c.rect(0, 0, 7 * mm, H, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.line(M, 16 * mm, W - M, 16 * mm)
    c.setFont("HK-Bold", 8)
    c.setFillColor(MUTED)
    c.drawString(M, 10.5 * mm, "HUSÍ KŮŽE / GOOSEBUMPS / ГУСЯЧА ШКІРА")
    c.drawRightString(W - M, 10.5 * mm, f"{page_no:02d}")
    c.setFillColor(PINK)
    c.setFont("HK-Bold", 8.5)
    c.drawString(M, H - 16 * mm, f"{section['no']} / {section['label']}")


def draw_cover(c: canvas.Canvas, data: dict[str, Any]) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    crop_image(c, "gallery/jehelnice-lebka.webp", W * 0.44, 0, W * 0.56, H, 0.88)
    c.setFillColor(PINK)
    c.rect(0, 0, 11 * mm, H, stroke=0, fill=1)
    c.setFillColor(ACID)
    c.rect(M, H - 37 * mm, 28 * mm, 5 * mm, stroke=0, fill=1)
    top = H - 53 * mm
    top = para(c, data["title"], style(35, 38, WHITE, True), M, top, W * 0.52)
    top -= 6 * mm
    top = para(c, data["subtitle"], style(16, 21, ACID, True), M, top, W * 0.49)
    top -= 14 * mm
    top = para(c, data["cover_note"], style(13.2, 19.2, WHITE), M, top, W * 0.46)
    c.setFillColor(WHITE)
    c.setFillAlpha(0.11)
    c.roundRect(M, 33 * mm, W * 0.48, 36 * mm, 4 * mm, stroke=0, fill=1)
    c.setFillAlpha(1)
    para(c, data["development"], style(8.8, 13, WHITE), M + 6 * mm, 62 * mm, W * 0.42)
    c.setFont("HK-Bold", 8.5)
    c.setFillColor(WHITE)
    c.drawString(M, 24 * mm, data["version"])
    c.setFillColor(ACID)
    c.drawString(M, 18 * mm, "ŠTĚPÁN CHALUPA · PRAHA")
    c.showPage()


def draw_default(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    page_base(c, section, page_no)
    image_h = 68 * mm
    crop_image(c, section["image"], W - M - 58 * mm, H - 20 * mm - image_h, 58 * mm, image_h)
    c.setFillColor(ACID)
    c.rect(W - M - 58 * mm, H - 23 * mm - image_h, 38 * mm, 3 * mm, stroke=0, fill=1)

    top = H - 28 * mm
    top = para(c, section["title"], STYLES["title"], M, top, W - 2 * M - 66 * mm)
    top -= 6 * mm
    top = para(c, section["lead"], STYLES["lead"], M, top, W - 2 * M - 66 * mm)
    top = min(top - 12 * mm, H - 104 * mm)

    if section.get("body"):
        for body in section["body"]:
            top = para(c, body, STYLES["body"], M, top, W - 2 * M)
            top -= 5 * mm

    if section.get("quote"):
        q_height = 36 * mm
        c.setFillColor(NAVY)
        c.roundRect(M, max(23 * mm, top - q_height), W - 2 * M, q_height, 3 * mm, stroke=0, fill=1)
        para(c, section["quote"], STYLES["quote"], M + 7 * mm, max(23 * mm, top - q_height) + q_height - 7 * mm, W - 2 * M - 14 * mm)

    if section.get("contact"):
        y = 25 * mm
        h = 54 * mm
        c.setFillColor(NAVY)
        c.roundRect(M, y, W - 2 * M, h, 3 * mm, stroke=0, fill=1)
        c.setFillColor(ACID)
        c.setFont("HK-Bold", 9)
        c.drawString(M + 7 * mm, y + h - 10 * mm, section["contact_title"])
        ctop = y + h - 17 * mm
        for item in section["contact"]:
            ctop = para(c, item, STYLES["contact"], M + 7 * mm, ctop, W - 2 * M - 14 * mm) - 1.5 * mm

    c.showPage()


def draw_cards(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    page_base(c, section, page_no)
    crop_image(c, section["image"], W - M - 52 * mm, H - 18 * mm - 56 * mm, 52 * mm, 56 * mm)
    top = H - 28 * mm
    top = para(c, section["title"], STYLES["title"], M, top, W - 2 * M - 60 * mm)
    top -= 5 * mm
    top = para(c, section["lead"], STYLES["lead"], M, top, W - 2 * M - 60 * mm)
    grid_top = min(top - 12 * mm, H - 92 * mm)
    gap = 5 * mm
    card_w = (W - 2 * M - gap) / 2
    card_h = 44 * mm
    for idx, (no, title, body) in enumerate(section["cards"]):
        col, row = idx % 2, idx // 2
        x = M + col * (card_w + gap)
        y = grid_top - (row + 1) * card_h - row * gap
        c.setFillColor(WHITE if idx != 2 else ACID)
        c.roundRect(x, y, card_w, card_h, 3 * mm, stroke=0, fill=1)
        c.setFillColor(PINK)
        c.setFont("HK-Bold", 9)
        c.drawString(x + 5 * mm, y + card_h - 8 * mm, no)
        t = y + card_h - 13 * mm
        t = para(c, title, STYLES["card_title"], x + 5 * mm, t, card_w - 10 * mm)
        para(c, body, STYLES["card_body"], x + 5 * mm, t - 3 * mm, card_w - 10 * mm)
    yq = 25 * mm
    c.setFillColor(NAVY)
    c.roundRect(M, yq, W - 2 * M, 34 * mm, 3 * mm, stroke=0, fill=1)
    para(c, section["quote"], style(14.5, 19, WHITE, True), M + 7 * mm, yq + 27 * mm, W - 2 * M - 14 * mm)
    c.showPage()


def draw_columns(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    page_base(c, section, page_no)
    crop_image(c, section["image"], W - M - 52 * mm, H - 18 * mm - 54 * mm, 52 * mm, 54 * mm)
    top = H - 28 * mm
    top = para(c, section["title"], STYLES["title"], M, top, W - 2 * M - 60 * mm)
    top -= 5 * mm
    para(c, section["lead"], STYLES["lead"], M, top, W - 2 * M - 60 * mm)
    y = H - 118 * mm
    gap = 4 * mm
    col_w = (W - 2 * M - 2 * gap) / 3
    for idx, (title, body) in enumerate(section["columns"]):
        x = M + idx * (col_w + gap)
        c.setFillColor([WHITE, ACID, WHITE][idx])
        c.roundRect(x, y, col_w, 72 * mm, 3 * mm, stroke=0, fill=1)
        c.setFillColor(PINK)
        c.rect(x, y + 66 * mm, col_w, 6 * mm, stroke=0, fill=1)
        para(c, title, STYLES["card_title"], x + 5 * mm, y + 58 * mm, col_w - 10 * mm)
        para(c, body, STYLES["card_body"], x + 5 * mm, y + 45 * mm, col_w - 10 * mm)
    para(c, section["body"][0], STYLES["body"], M, y - 9 * mm, W - 2 * M)
    c.showPage()


def draw_steps(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    page_base(c, section, page_no)
    crop_image(c, section["image"], W - M - 52 * mm, H - 18 * mm - 54 * mm, 52 * mm, 54 * mm)
    top = H - 28 * mm
    top = para(c, section["title"], STYLES["title"], M, top, W - 2 * M - 60 * mm)
    top -= 5 * mm
    para(c, section["lead"], STYLES["lead"], M, top, W - 2 * M - 60 * mm)
    y = H - 103 * mm
    step_h = 37 * mm
    for idx, (no, title, body) in enumerate(section["steps"]):
        yy = y - idx * (step_h + 3 * mm)
        c.setFillColor(WHITE if idx % 2 == 0 else ACID)
        c.roundRect(M, yy - step_h, W - 2 * M, step_h, 3 * mm, stroke=0, fill=1)
        c.setFillColor(PINK)
        c.setFont("HK-Bold", 21)
        c.drawString(M + 6 * mm, yy - 13 * mm, no)
        x = M + 24 * mm
        t = para(c, title, STYLES["card_title"], x, yy - 7 * mm, W - M - x - 7 * mm)
        para(c, body, STYLES["card_body"], x, t - 2 * mm, W - M - x - 7 * mm)
    c.showPage()


def draw_bullets(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    page_base(c, section, page_no)
    crop_image(c, section["image"], W - M - 52 * mm, H - 18 * mm - 54 * mm, 52 * mm, 54 * mm)
    top = H - 28 * mm
    top = para(c, section["title"], STYLES["title"], M, top, W - 2 * M - 60 * mm)
    top -= 5 * mm
    para(c, section["lead"], STYLES["lead"], M, top, W - 2 * M - 60 * mm)
    start_y = H - 103 * mm
    gap = 4 * mm
    col_w = (W - 2 * M - gap) / 2
    box_h = 28 * mm
    for idx, item in enumerate(section["bullets"]):
        col, row = idx % 2, idx // 2
        x = M + col * (col_w + gap)
        y = start_y - row * (box_h + 3 * mm) - box_h
        c.setFillColor(WHITE if idx % 3 else ACID)
        c.roundRect(x, y, col_w, box_h, 2 * mm, stroke=0, fill=1)
        c.setFillColor(PINK)
        c.setFont("HK-Bold", 9)
        c.drawString(x + 4 * mm, y + box_h - 7 * mm, f"{idx + 1:02d}")
        para(c, item, style(8.9, 11.8, INK), x + 12 * mm, y + box_h - 5 * mm, col_w - 16 * mm)
    c.setFillColor(NAVY)
    c.roundRect(M, 22 * mm, W - 2 * M, 29 * mm, 3 * mm, stroke=0, fill=1)
    para(c, section["note"], style(9.4, 13.5, WHITE, True), M + 6 * mm, 44 * mm, W - 2 * M - 12 * mm)
    c.showPage()


def draw_sources(c: canvas.Canvas, section: dict[str, Any], page_no: int) -> None:
    page_base(c, section, page_no)
    crop_image(c, section["image"], W - M - 52 * mm, H - 18 * mm - 54 * mm, 52 * mm, 54 * mm)
    top = H - 28 * mm
    top = para(c, section["title"], STYLES["title"], M, top, W - 2 * M - 60 * mm)
    top -= 5 * mm
    para(c, section["lead"], STYLES["lead"], M, top, W - 2 * M - 60 * mm)
    y = H - 118 * mm
    for idx, item in enumerate(section["sources"]):
        c.setFillColor(WHITE if idx % 2 == 0 else HexColor("#ECE8E1"))
        c.roundRect(M, y - 14 * mm, W - 2 * M, 13 * mm, 2 * mm, stroke=0, fill=1)
        c.setFillColor(PINK)
        c.setFont("HK-Bold", 9)
        c.drawString(M + 5 * mm, y - 8.7 * mm, f"{idx + 1:02d}")
        para(c, item, style(8.4, 11.2, INK), M + 18 * mm, y - 4.7 * mm, W - 2 * M - 23 * mm)
        y -= 16 * mm
    c.setFillColor(NAVY)
    c.roundRect(M, 23 * mm, W - 2 * M, 28 * mm, 3 * mm, stroke=0, fill=1)
    para(c, section["note"], style(10, 14, WHITE, True), M + 6 * mm, 43 * mm, W - 2 * M - 12 * mm)
    c.showPage()


def build(locale: str, data: dict[str, Any]) -> Path:
    out = OUT / data["file"]
    c = canvas.Canvas(str(out), pagesize=A4, pageCompression=1)
    c.setTitle(f"{data['title']} - {data['subtitle']}")
    c.setAuthor("Štěpán Chalupa")
    c.setSubject("Working concept for the Husí kůže / Goosebumps documentary portrait series")
    draw_cover(c, data)
    for page_no, section in enumerate(data["sections"], start=2):
        if section.get("cards"):
            draw_cards(c, section, page_no)
        elif section.get("columns"):
            draw_columns(c, section, page_no)
        elif section.get("steps"):
            draw_steps(c, section, page_no)
        elif section.get("bullets"):
            draw_bullets(c, section, page_no)
        elif section.get("sources"):
            draw_sources(c, section, page_no)
        else:
            draw_default(c, section, page_no)
    c.save()
    return out


if __name__ == "__main__":
    for locale, data in CONTENT.items():
        if locale == "cs":
            # The Czech master is the original dense 18-page editorial edition.
            # Keep it as the visual/content source of truth instead of replacing
            # it with the later sparse automatic layout.
            path = OUT / data["file"]
            copyfile(ROOT / "public" / "FOOTAGE_HUSI_KUZE_v4.5.pdf", path)
        else:
            path = build(locale, data)
        print(f"{locale}: {path} ({path.stat().st_size} bytes)")
