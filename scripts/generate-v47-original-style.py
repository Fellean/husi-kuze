#!/usr/bin/env python3
from __future__ import annotations

import runpy
from pathlib import Path
from typing import Any

from PIL import Image as PILImage
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads"
OUT.mkdir(parents=True, exist_ok=True)
CACHE = ROOT / "tmp" / "pdf-images-v47-q80"
CACHE.mkdir(parents=True, exist_ok=True)
BASE = runpy.run_path(str(ROOT / "scripts" / "generate-project-pdfs.py"))["CONTENT"]

W, H = A4
PAPER = HexColor("#F5F1EA")
INK = HexColor("#111820")
PINK = HexColor("#ED2859")
ACID = HexColor("#C8FF18")
NAVY = HexColor("#0D304E")
WHITE = HexColor("#FFFFFF")
MUTED = HexColor("#5F646A")
LINE = HexColor("#C9C4BC")

pdfmetrics.registerFont(TTFont("HK-Sans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("HK-Sans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("HK-Serif", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("HK-Serif-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"))

LOGOS = {
    "cs": ROOT / "tmp" / "pdf-brand" / "cs.png",
    "en": ROOT / "tmp" / "pdf-brand" / "en.png",
    "uk": ROOT / "tmp" / "pdf-brand" / "uk.png",
}

EXTRA = {
    "cs": {
        "file": "husi-kuze-koncepce-cs.pdf",
        "version": "Pracovní koncepce · verze 4.8 · červenec 2026",
        "cover": "Filmové portréty doteku, hlasu a hranic.",
        "labels": [
            "O CO JDE", "PROČ", "VZÍT SI ZPÁTKY", "JAK PORTRÉT VZNIKÁ", "ROZSAH",
            "LIDÉ + HLAS", "MÍSTO A OBRAZ", "ZVUK A TICHO", "BEZPEČÍ", "CO VZNIKNE",
            "AUTOR", "OSOBNÍ VÝCHODISKO", "OBRAZOVÝ ATLAS I", "OBRAZOVÝ ATLAS II",
            "OBRAZOVÝ ATLAS III", "VÝCHODISKA", "KONTAKT",
        ],
        "reclaim_title": "Vzít si zpátky všechno to člověčí.",
        "reclaim": [
            "Práci, která dává smysl. Čas, který nemusí být výkonem. Pozornost mimo algoritmus. Tělo, které není značkou, důkazem hodnoty ani materiálem pro cizí pohled.",
            "Husí kůže nevykupuje zranitelnost estetickým obrazem. Zkouší vytvořit malý prostor, v němž člověk určuje, co ze sebe ukáže, komu, kdy a s jakým dosahem.",
        ],
        "reclaim_quote": "Viditelnost není totéž co možnost rozhodovat. Pozornost není totéž co blízkost.",
        "reclaim_cards": [
            ("PRÁCE", "která nese smysl, ne jen výkon"),
            ("ČAS", "který nemusí dokazovat produktivitu"),
            ("TĚLO", "které není profil ani reklamní plocha"),
            ("BLÍZKOST", "která není odměna ani směna"),
        ],
        "project_questions": [
            "Kdy se v obraze poznávám jako jednající člověk?",
            "Kdy se ze mě stává materiál pro cizí význam?",
            "Kdo rozhoduje o střihu, kontextu a dosahu?",
        ],
        "why_tiles": [
            ("TĚLO", "není nekonečný projekt"),
            ("POZORNOST", "není blízkost"),
            ("INTIMITA", "není výkon"),
            ("VIDITELNOST", "není možnost rozhodovat"),
        ],
        "sound_title": "Zvuk není návod, co má divák cítit.",
        "sound": [
            "Dech, polknutí, tření látky, dlaň po kůži, bosý krok a ticho místa jsou rovnocennou vrstvou portrétu. Hudba není povinná a na webu není přehrávač.",
            "Intolerance a Na trávě mezi stromy jsou pracovní pokusy a materiály k nedokončeným projektům. Hajluje celá rodina je satira na vzestup krajní pravice, ne oslava ani soundtrack Husí kůže.",
        ],
        "vuln_title": "Odvaha k zranitelnosti",
        "vuln": [
            "Tři roky jsem téměř neopouštěl byt. Senzorická obrana, úzkost a představa normálního smrtelníka vytvořily pevnost, která mě chránila a současně izolovala.",
            "Rok 2026 pro mě není vítězný reboot. Je to pokus znovu vstoupit do světa — přes cestu na sever, stěhování, přátelství, chladnou vodu i chvíle, kdy mi bylo prostě na hovno.",
            "Zranitelnost tu neznamená odhalit všechno. Znamená přestat hrát dokonale připravenou roli a přitom si ponechat právo říct ne.",
        ],
        "vuln_quote": "Zaťatá pěst dokáže přežít úder, ale nedokáže obejmout.",
        "closing": "První setkání je bez kamery, bez svlékání, bez závazku a bez přesvědčování.",
        "funding": "NÁKLADY → TRANSPARENTNOST → PŘÍPADNÝ PŘEBYTEK NA DOBROČINNÉ AKTIVITY",
        "atlas": [
            ("Přecitlivělost / obrana", "Ochrana, která se může proměnit v klec."),
            ("Hmota / kontakt", "Tělo a materiál bez předem dané hierarchie."),
            ("Tvář / umlčení", "Přítomnost, jejíž hlas prochází cizími filtry."),
            ("Pohled / deformace", "Narušení jistoty, co je povrch a co prostor."),
            ("Lebka / něha", "Konečnost, ruční práce a absurdní srdce."),
            ("Konstrukce / instituce", "Aparát, který nese i rozhoduje, kdo smí vstoupit."),
            ("Metafyzická pouť", "Pracovní mapa konce strachu ze zranitelnosti."),
            ("Rukopis / stopa", "Cizí věta jako malý nevyžádaný akt péče."),
            ("Švédsko / odpojení", "Ticho z doby, kdy mi nebylo dobře."),
            ("Kalení / únik", "Společenský pohyb místo přiznané únavy."),
            ("Role / maska", "Hravost jako svoboda i kryt."),
            ("Prudký potok / návrat", "Vlastní tělo v obraze, ne riziko přenesené na druhé."),
        ],
    },
    "en": {
        "file": "goosebumps-project-concept-en.pdf",
        "version": "Working concept · version 5.1 · July 2026",
        "cover": "Film portraits of touch, voice and boundaries.",
        "labels": [
            "THE PROJECT", "WHY", "TAKING IT BACK", "HOW A PORTRAIT IS MADE", "SCOPE",
            "PEOPLE + VOICE", "PLACE AND IMAGE", "SOUND AND SILENCE", "SAFETY", "WHAT IS MADE",
            "AUTHOR", "PERSONAL POINT OF DEPARTURE", "AUTHORIAL VISUAL LANGUAGE", "WORKS / TOUCH + SURFACE",
            "WORKS / VOICE + RISK", "REFERENCES", "CONTACT",
        ],
        "reclaim_title": "Taking back everything that makes us human.",
        "reclaim": [
            "Work that makes sense. Time that need not be productive. Attention outside the algorithm. A body that is neither a brand, proof of worth, nor raw material for somebody else’s gaze.",
            "Goosebumps does not redeem vulnerability through a beautiful image. It tries to create a small space in which a person decides what to show, to whom, when, and with what reach.",
        ],
        "reclaim_quote": "Visibility is not the same as agency. Attention is not the same as closeness.",
        "reclaim_cards": [
            ("WORK", "that carries meaning, not only performance"),
            ("TIME", "that need not prove productivity"),
            ("BODY", "that is neither a profile nor ad space"),
            ("CLOSENESS", "that is neither reward nor exchange"),
        ],
        "project_questions": [
            "When do I recognise myself as an acting subject?",
            "When do I become material for somebody else’s meaning?",
            "Who decides the edit, context and reach?",
        ],
        "why_tiles": [
            ("BODY", "is not an endless project"),
            ("ATTENTION", "is not closeness"),
            ("INTIMACY", "is not performance"),
            ("VISIBILITY", "is not agency"),
        ],
        "sound_title": "Sound does not instruct the viewer what to feel.",
        "sound": [
            "Breath, swallowing, fabric, a hand on skin, a bare foot and the silence of a place are equal layers of a portrait. Music is optional, and the website contains no audio player.",
            "Intolerance and Na trávě mezi stromy are working experiments and material for unfinished projects. Hajluje celá rodina is a satire on the rise of the far right, not a celebration or the Goosebumps soundtrack.",
        ],
        "vuln_title": "The courage to be vulnerable",
        "vuln": [
            "For three years I barely left my flat. Sensory defence, anxiety and my idea of a normal human being built a fortress that protected me and isolated me at the same time.",
            "For me, 2026 is not a triumphant reboot. It is an attempt to re-enter the world — through a northern journey, moving home, friendship, cold water and days that were simply fucking awful.",
            "Vulnerability here does not mean revealing everything. It means no longer performing a perfectly prepared role while retaining the right to say no.",
        ],
        "vuln_quote": "A clenched fist can survive a blow, but it cannot embrace.",
        "closing": "The first meeting is without a camera, undressing, obligation or persuasion.",
        "feedback_title": "WHAT CHANGED AFTER EARLY FEEDBACK",
        "feedback": [
            "The first message names one role: participation, consultation or collaboration.",
            "A fully dressed portrait is equal. Nudity is never the “advanced” version.",
            "A refusal ends recruitment; there is no persuasive follow-up.",
            "Consent approves a specific cut and use, not a blanket permission in advance.",
        ],
        "funding": "COSTS → TRANSPARENCY → ANY SURPLUS TO CHARITABLE ACTIVITIES",
        "atlas": [
            ("Sensitivity / defence", "Protection that can turn into a cage."),
            ("Matter / contact", "Body and material without a preset hierarchy."),
            ("Face / silencing", "A presence whose voice passes through foreign filters."),
            ("Gaze / distortion", "Uncertainty about surface and space."),
            ("Skull / tenderness", "Mortality, handwork and an absurd heart."),
            ("Structure / institution", "An apparatus that supports and controls entry."),
            ("Metaphysical journey", "A working map of the end of fearing vulnerability."),
            ("Handwriting / trace", "A stranger’s sentence as an unsolicited act of care."),
            ("Sweden / disconnection", "Silence from a period when I was unwell."),
            ("Partying / escape", "Social motion instead of admitted fatigue."),
            ("Persona / mask", "Play as freedom and cover."),
            ("Prudký potok / return", "My own body in the image, not risk shifted onto others."),
        ],
        "works": [
            (
                "Carolee Schneemann · Fuses · 1964–1967",
                "Her own lovemaking is disrupted by dyeing, scratching, burning and layering the filmstrip. The body becomes film material, duration and texture rather than a smooth object.",
            ),
            (
                "Barbara Hammer · Dyketactics · 1974",
                "A four-minute montage of bodies, nature and queer closeness. Editing composes touch through colour, movement and surface instead of turning bodies into performance.",
            ),
            (
                "Pipilotti Rist · Pickelporno · 1992",
                "Extreme bodily details merge with nature and psychedelic colour. The camera moves between touching people without translating their closeness into a conventional pornographic gaze.",
            ),
            (
                "Barbara Hammer · Sync Touch · 1981",
                "The film places touch and vision at the centre of its form. It is a precise reference for the aim of Goosebumps: not merely showing touch, but letting the image think haptically.",
            ),
            (
                "Clio Barnard · The Arbor · 2010",
                "Actors lip-sync authentic interviews. Vocabulary, rhythm and breath remain while the visible face belongs to someone else: a model of anonymity that does not erase personality.",
            ),
            (
                "Clayton Cubitt · Hysterical Literature · 2012",
                "A face, voice and concentration carry a bodily response to off-screen stimulation. Its formal economy is useful; its experimental frame also warns how easily a person can become a result.",
            ),
            (
                "John Cameron Mitchell · Shortbus · 2006",
                "Explicit sexuality remains part of characters’ lives, humour and relationships. Explicitness does not flatten a person by itself; flattening begins when their world disappears.",
            ),
            (
                "Marina Abramović · Rhythm 0 · 1974",
                "For six hours the artist offered her body and 72 objects to an audience. For this project it works mainly as a contrast: a participant must never cease to be an acting co-author.",
            ),
        ],
    },
    "uk": {
        "file": "husyacha-shkira-kontseptsiya-uk.pdf",
        "version": "Робоча концепція · версія 5.1 · липень 2026",
        "cover": "Кінопортрети дотику, голосу й меж.",
        "labels": [
            "ПРО ЩО ПРОЄКТ", "НАВІЩО", "ПОВЕРНУТИ СОБІ", "ЯК СТВОРЮЄТЬСЯ ПОРТРЕТ", "МЕЖІ",
            "ЛЮДИ + ГОЛОС", "МІСЦЕ Й ЗОБРАЖЕННЯ", "ЗВУК І ТИША", "БЕЗПЕКА", "ЩО ВИНИКНЕ",
            "АВТОР", "ОСОБИСТЕ ПІДҐРУНТЯ", "АВТОРСЬКА ВІЗУАЛЬНА МОВА", "ТВОРИ / ДОТИК + ПОВЕРХНЯ",
            "ТВОРИ / ГОЛОС + РИЗИК", "ДЖЕРЕЛА", "КОНТАКТ",
        ],
        "reclaim_title": "Повернути собі все людське.",
        "reclaim": [
            "Роботу, що має сенс. Час, який не мусить бути продуктивним. Увагу поза алгоритмом. Тіло, що не є брендом, доказом цінності чи матеріалом для чужого погляду.",
            "«Гусяча шкіра» не викуповує вразливість красивим зображенням. Вона створює малий простір, де людина вирішує, що показати, кому, коли й з яким охопленням.",
        ],
        "reclaim_quote": "Видимість — не те саме, що право вирішувати. Увага — не те саме, що близькість.",
        "reclaim_cards": [
            ("ПРАЦЯ", "що має сенс, а не лише вимагає результату"),
            ("ЧАС", "який не мусить доводити продуктивність"),
            ("ТІЛО", "що не є профілем чи рекламною площиною"),
            ("БЛИЗЬКІСТЬ", "що не є винагородою або обміном"),
        ],
        "project_questions": [
            "Коли я впізнаю себе в образі як діючу людину?",
            "Коли я стаю матеріалом для чужого значення?",
            "Хто вирішує щодо монтажу, контексту й охоплення?",
        ],
        "why_tiles": [
            ("ТІЛО", "не є нескінченним проєктом"),
            ("УВАГА", "не є близькістю"),
            ("ІНТИМНІСТЬ", "не є виконанням"),
            ("ВИДИМІСТЬ", "не є правом вирішувати"),
        ],
        "sound_title": "Звук не наказує глядачеві, що відчувати.",
        "sound": [
            "Дихання, ковтання, тертя тканини, долоня на шкірі, босий крок і тиша місця — рівноправні шари портрета. Музика необов’язкова, а на сайті немає аудіоплеєра.",
            "Intolerance і Na trávě mezi stromy — робочі експерименти та матеріали до незавершених проєктів. Hajluje celá rodina — сатира на піднесення крайньої правиці, а не прославляння чи саундтрек «Гусячої шкіри».",
        ],
        "vuln_title": "Сміливість бути вразливим",
        "vuln": [
            "Три роки я майже не виходив із квартири. Сенсорний захист, тривога й уявлення про нормальну людину збудували фортецю, яка водночас захищала й ізолювала мене.",
            "2026 рік для мене не є тріумфальним перезапуском. Це спроба повернутися у світ — через подорож на північ, переїзд, дружбу, холодну воду й дні, коли все було просто пиздець.",
            "Вразливість тут не означає показати все. Вона означає перестати грати бездоганно підготовлену роль і водночас зберегти право сказати «ні».",
        ],
        "vuln_quote": "Стиснутий кулак може витримати удар, але не може обійняти.",
        "closing": "Перша зустріч — без камери, роздягання, зобов’язань і переконування.",
        "feedback_title": "ЩО ЗМІНИЛОСЯ ПІСЛЯ ПЕРШИХ ВІДГУКІВ",
        "feedback": [
            "Перше повідомлення називає одну роль: участь, консультація або співпраця.",
            "Портрет в одязі є рівноцінним. Оголення не є «просунутішою» версією.",
            "Відмова завершує запрошення; переконливих повторних повідомлень не буде.",
            "Згода стосується конкретного монтажу й використання, а не загального дозволу наперед.",
        ],
        "funding": "ВИТРАТИ → ПРОЗОРІСТЬ → МОЖЛИВИЙ НАДЛИШОК НА БЛАГОДІЙНІ ІНІЦІАТИВИ",
        "atlas": [
            ("Чутливість / захист", "Захист, що може перетворитися на клітку."),
            ("Матерія / контакт", "Тіло й матеріал без наперед заданої ієрархії."),
            ("Обличчя / замовчування", "Присутність, чий голос проходить крізь чужі фільтри."),
            ("Погляд / деформація", "Непевність щодо поверхні й простору."),
            ("Череп / ніжність", "Смертність, ручна робота й абсурдне серце."),
            ("Конструкція / інституція", "Апарат, що підтримує й контролює вхід."),
            ("Метафізична подорож", "Робоча мапа кінця страху вразливості."),
            ("Почерк / слід", "Чужа фраза як маленький акт турботи."),
            ("Швеція / від’єднання", "Тиша з періоду, коли мені було недобре."),
            ("Вечірки / втеча", "Соціальний рух замість визнаної втоми."),
            ("Роль / маска", "Гра як свобода й укриття."),
            ("Прудкий потік / повернення", "Власне тіло в кадрі, а не ризик, перекладений на інших."),
        ],
        "works": [
            (
                "Carolee Schneemann · Fuses · 1964–1967",
                "Власний акт кохання художниці розірвано фарбуванням, дряпанням, випалюванням і нашаруванням плівки. Тіло стає матеріалом фільму, часом і фактурою, а не гладким об’єктом.",
            ),
            (
                "Barbara Hammer · Dyketactics · 1974",
                "Чотирихвилинний монтаж тіл, природи й квір-близькості. Монтаж складає пам’ять дотику з кольору, руху й поверхні, не перетворюючи тіла на виконання.",
            ),
            (
                "Pipilotti Rist · Pickelporno · 1992",
                "Надзвичайно крупні плани тіла переплітаються з природою та психоделічним кольором. Камера входить між людьми, що торкаються, не перекладаючи близькість у звичний порнографічний погляд.",
            ),
            (
                "Barbara Hammer · Sync Touch · 1981",
                "Фільм ставить зв’язок між дотиком і баченням у центр власної форми. Це точне формулювання мети: не лише показати дотик, а дозволити зображенню мислити гаптично.",
            ),
            (
                "Clio Barnard · The Arbor · 2010",
                "Актори синхронізують губи з автентичними інтерв’ю. Словник, ритм і дихання залишаються, тоді як видиме обличчя належить іншій людині: модель анонімізації без втрати особистості.",
            ),
            (
                "Clayton Cubitt · Hysterical Literature · 2012",
                "Обличчя, голос і зосередження несуть тілесну реакцію на стимуляцію поза кадром. Формальна простота корисна; рамка експерименту водночас застерігає від перетворення людини на результат.",
            ),
            (
                "John Cameron Mitchell · Shortbus · 2006",
                "Відкрита сексуальність залишається частиною життя, гумору й стосунків персонажів. Відвертість сама не спрощує людину; спрощення починається, коли з кадру зникає її світ.",
            ),
            (
                "Marina Abramović · Rhythm 0 · 1974",
                "Шість годин художниця віддала публіці своє тіло й 72 предмети. Для цього проєкту робота важлива передусім як контраст: учасник не має перестати бути діючим співавтором.",
            ),
        ],
    },
}

ATLAS_IMAGES = [
    "jehelnice-lebka.webp", "drevo-telo.webp", "umlcena-tvar.webp", "sklenene-oko.webp",
    "lebka-srdce.webp", "konstruktivisticka-vez.webp", "autor-metafyzicka-pout.webp", "ty-to-zvladnes-rukopis.webp",
    "autor-svedsko.webp", "autor-kaleni.webp", "autor-role.webp", "prudky-potok-explicitni-optimized.webp",
]


def image_path(name: str) -> Path:
    source = ROOT / "public" / "gallery" / name
    cached = CACHE / f"{Path(name).stem}.jpg"
    if not cached.exists() or cached.stat().st_mtime < source.stat().st_mtime:
        with PILImage.open(source) as image:
            image = image.convert("RGB")
            image.thumbnail((1500, 1500), PILImage.Resampling.LANCZOS)
            image.save(cached, "JPEG", quality=80, optimize=True, progressive=True)
    return cached


def draw_crop(
    c: Canvas,
    path: Path,
    x: float,
    y: float,
    w: float,
    h: float,
    focus=(0.5, 0.5),
    radius: float = 0,
) -> None:
    with PILImage.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x - (dw - w) * focus[0]
    dy = y - (dh - h) * focus[1]
    c.saveState()
    p = c.beginPath()
    if radius:
        p.roundRect(x, y, w, h, radius)
    else:
        p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, dw, dh, mask="auto")
    c.restoreState()


def para(c: Canvas, text: str, x: float, y_top: float, w: float, *, size=10.2, leading=15.0,
         color=INK, font="HK-Serif", gap=4 * mm, max_h=200 * mm) -> float:
    style = ParagraphStyle(
        "body", fontName=font, fontSize=size, leading=leading, textColor=color,
        spaceAfter=gap, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(text, style)
    pw, ph = p.wrap(w, max_h)
    p.drawOn(c, x, y_top - ph)
    return y_top - ph - gap


def heading(c: Canvas, text: str, x: float, y_top: float, w: float, *, size=30, leading=32,
            color=INK, font="HK-Sans-Bold") -> float:
    style = ParagraphStyle("heading", fontName=font, fontSize=size, leading=leading, textColor=color)
    p = Paragraph(text, style)
    pw, ph = p.wrap(w, 100 * mm)
    p.drawOn(c, x, y_top - ph)
    return y_top - ph


def page_mark(c: Canvas, no: int, label: str, *, dark=False) -> None:
    color = WHITE if dark else INK
    c.setFillColor(PINK)
    c.rect(0, H - 5 * mm, W, 5 * mm, stroke=0, fill=1)
    c.setFillColor(color)
    c.setFont("HK-Sans-Bold", 7.5)
    c.drawString(16 * mm, 10 * mm, f"{no:02d} · {label}")
    c.drawRightString(W - 16 * mm, 10 * mm, "FOOTAGE · 2026")


def draw_logo(c: Canvas, lang: str, x: float, y: float, w: float) -> None:
    path = LOGOS[lang]
    if path.exists():
        with PILImage.open(path) as im:
            iw, ih = im.size
        c.drawImage(ImageReader(str(path)), x, y, w, w * ih / iw, mask="auto")
        return

    lines = {
        "cs": ("HUSÍ", "KŮŽE"),
        "en": ("GOOSE", "BUMPS"),
        "uk": ("ГУСЯЧА", "ШКІРА"),
    }[lang]
    size = 20 if lang != "uk" else 15.5
    leading = size * 1.02
    c.saveState()
    c.setFillColor(NAVY)
    c.setFont("HK-Sans-Bold", size)
    c.drawString(x, y + leading, lines[0])
    c.setFillColor(PINK)
    c.drawString(x, y, lines[1])
    c.setFillColor(ACID)
    c.circle(x + w - 7 * mm, y + leading + 3 * mm, 4.2 * mm, stroke=0, fill=1)
    c.restoreState()


def draw_body_page(
    c: Canvas,
    no: int,
    label: str,
    section: dict[str, Any],
    image: str,
    cfg: dict[str, Any],
    *,
    dark=False,
) -> None:
    bg = NAVY if dark else PAPER
    fg = WHITE if dark else INK
    c.setFillColor(bg)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path(image), 7 * mm, 16 * mm, 69 * mm, H - 31 * mm, radius=5 * mm)
    c.setFillColor(ACID if dark else PINK)
    c.rect(76 * mm, 0, 3 * mm, H - 5 * mm, stroke=0, fill=1)
    x, width = 93 * mm, W - 109 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 25 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 35 * mm, width, size=25, leading=27, color=fg)
    y = para(c, section["lead"], x, y - 6 * mm, width, size=11.2, leading=16.2, color=fg, font="HK-Serif-Bold")
    for p in section.get("body", []):
        y = para(c, p, x, y, width, size=9.3, leading=13.5, color=fg, gap=3.3 * mm)
    if y > 92 * mm:
        c.setFillColor(ACID if dark else NAVY)
        c.roundRect(x, 58 * mm, width, 48 * mm, 4 * mm, stroke=0, fill=1)
        question_color = INK if dark else WHITE
        question_y = 99 * mm
        for i, question in enumerate(cfg["project_questions"], 1):
            c.setFillColor(PINK if dark else ACID)
            c.setFont("HK-Sans-Bold", 7.2)
            c.drawString(x + 6 * mm, question_y - 1 * mm, f"0{i}")
            question_y = para(
                c,
                question,
                x + 16 * mm,
                question_y,
                width - 22 * mm,
                size=8.2,
                leading=10.8,
                color=question_color,
                font="HK-Sans-Bold",
                gap=2 * mm,
            )
    if section.get("quote"):
        c.setFillColor(PINK)
        c.roundRect(x, 23 * mm, width, 26 * mm, 4 * mm, stroke=0, fill=1)
        para(c, section["quote"], x + 6 * mm, 43 * mm, width - 12 * mm, size=9.4, leading=13.2,
             color=WHITE, font="HK-Serif-Bold", gap=0)
    page_mark(c, no, label, dark=dark)
    c.showPage()


def cover(c: Canvas, lang: str, cfg: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("jehelnice-lebka.webp"), 82 * mm, 0, W - 82 * mm, H, focus=(0.55, 0.5))
    c.setFillColor(PINK)
    c.rect(0, 0, 8 * mm, H, stroke=0, fill=1)
    draw_logo(c, lang, 18 * mm, H - 111 * mm, 57 * mm)
    para(c, cfg["cover"], 18 * mm, H - 122 * mm, 55 * mm,
         size=12.2, leading=16.2, color=NAVY, font="HK-Serif-Bold", gap=0)
    para(c, cfg["version"], 18 * mm, 33 * mm, 55 * mm,
         size=7.4, leading=9.5, color=INK, font="HK-Sans", gap=0)
    c.setFillColor(ACID)
    c.rect(18 * mm, 14 * mm, 52 * mm, 8 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("HK-Sans-Bold", 7.5)
    c.drawCentredString(44 * mm, 16.6 * mm, "18+ · WORK IN PROGRESS")
    c.showPage()


def why_page(c: Canvas, no: int, label: str, section: dict[str, Any], cfg: dict[str, Any]) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    x = 18 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, W - 36 * mm, size=30, leading=31, color=WHITE)
    y = para(c, section["lead"], x, y - 7 * mm, W - 36 * mm, size=11.2, leading=15.7, color=WHITE, font="HK-Serif-Bold")
    body = section.get("body", [])
    if body:
        col_w = (W - 42 * mm) / 2
        for i, body_text in enumerate(body[:2]):
            para(
                c,
                body_text,
                x + i * (col_w + 6 * mm),
                y - 1 * mm,
                col_w,
                size=8.25,
                leading=11.6,
                color=WHITE,
                gap=0,
            )
    tiles = cfg["why_tiles"]
    tw = (W - 39 * mm) / 2
    for i, (a, b) in enumerate(tiles):
        col, row = i % 2, i // 2
        tx = 18 * mm + col * (tw + 3 * mm)
        ty = 27 * mm + (1 - row) * 39 * mm
        c.setFillColor([PINK, ACID, PAPER, INK][i])
        c.roundRect(tx, ty, tw, 35 * mm, 4 * mm, stroke=0, fill=1)
        c.setFillColor(INK if i in (1, 2) else WHITE)
        c.setFont("HK-Sans-Bold", 14)
        c.drawString(tx + 7 * mm, ty + 21 * mm, a)
        c.setFont("HK-Serif", 10)
        c.drawString(tx + 7 * mm, ty + 10 * mm, b)
    page_mark(c, no, label, dark=True)
    c.showPage()


def reclaim_page(c: Canvas, no: int, label: str, cfg: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("drevo-telo.webp"), 9 * mm, 10 * mm, W - 18 * mm, 96 * mm, focus=(0.5, 0.45), radius=6 * mm)
    c.setFillColor(NAVY)
    c.rect(0, 112 * mm, W, H - 112 * mm, stroke=0, fill=1)
    x = 18 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, cfg["reclaim_title"], x, H - 36 * mm, W - 36 * mm, size=31, leading=32, color=WHITE)
    col_w = (W - 42 * mm) / 2
    for i, p in enumerate(cfg["reclaim"]):
        para(c, p, x + i * (col_w + 6 * mm), y - 10 * mm, col_w, size=9.2, leading=13.3, color=WHITE)
    card_w = (W - 45 * mm) / 2
    for i, (title, body) in enumerate(cfg["reclaim_cards"]):
        col, row = i % 2, i // 2
        cx = x + col * (card_w + 9 * mm)
        cy = 119 * mm + (1 - row) * 27 * mm
        c.setFillColor([PINK, ACID, PAPER, INK][i])
        c.roundRect(cx, cy, card_w, 23 * mm, 3 * mm, stroke=0, fill=1)
        color = INK if i in (1, 2) else WHITE
        c.setFillColor(color)
        c.setFont("HK-Sans-Bold", 8.2)
        c.drawString(cx + 5 * mm, cy + 14 * mm, title)
        para(c, body, cx + 5 * mm, cy + 10 * mm, card_w - 10 * mm, size=7.1, leading=8.7,
             color=color, gap=0)
    c.setFillColor(ACID)
    c.roundRect(18 * mm, 108 * mm, W - 36 * mm, 9 * mm, 3 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("HK-Serif-Bold", 10)
    c.drawCentredString(W / 2, 111 * mm, cfg["reclaim_quote"])
    page_mark(c, no, label, dark=True)
    c.showPage()


def process_page(c: Canvas, no: int, label: str, section: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    x = 18 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, W - 36 * mm, size=31, leading=32)
    para(c, section["lead"], x, y - 7 * mm, W - 36 * mm, size=11.5, leading=16.5, font="HK-Serif-Bold")
    draw_crop(
        c,
        image_path("zimni-nadrazi.webp"),
        18 * mm,
        164 * mm,
        W - 36 * mm,
        40 * mm,
        focus=(0.5, 0.55),
        radius=5 * mm,
    )
    steps = section.get("steps", [])
    sw = (W - 42 * mm) / 2
    for i, (n, title, body) in enumerate(steps):
        col, row = i % 2, i // 2
        sx = x + col * (sw + 6 * mm)
        sy = 31 * mm + (1 - row) * 67 * mm
        c.setFillColor(WHITE if i != 3 else NAVY)
        c.rect(sx, sy, sw, 61 * mm, stroke=0, fill=1)
        c.setFillColor(PINK)
        c.setFont("HK-Sans-Bold", 9)
        c.drawString(sx + 7 * mm, sy + 49 * mm, n)
        c.setFillColor(WHITE if i == 3 else INK)
        c.setFont("HK-Sans-Bold", 14)
        c.drawString(sx + 7 * mm, sy + 37 * mm, title)
        para(c, body, sx + 7 * mm, sy + 31 * mm, sw - 14 * mm, size=8.7, leading=12.2,
             color=WHITE if i == 3 else INK, gap=0)
    page_mark(c, no, label)
    c.showPage()


def cards_page(c: Canvas, no: int, label: str, section: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("drevo-telo.webp"), 0, H - 91 * mm, W, 86 * mm)
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(18 * mm, H - 22 * mm, f"{no:02d} · {label}")
    c.setFillColor(PAPER)
    c.rect(18 * mm, H - 76 * mm, W - 36 * mm, 42 * mm, stroke=0, fill=1)
    heading(c, section["title"], 24 * mm, H - 42 * mm, W - 48 * mm, size=25, leading=27)
    cards = section["cards"]
    cw = (W - 42 * mm) / 2
    for i, (n, title, body) in enumerate(cards):
        col, row = i % 2, i // 2
        x = 18 * mm + col * (cw + 6 * mm)
        y = 30 * mm + (1 - row) * 61 * mm
        c.setFillColor([NAVY, WHITE, PINK, ACID][i])
        c.rect(x, y, cw, 55 * mm, stroke=0, fill=1)
        color = WHITE if i in (0, 2) else INK
        c.setFillColor(color)
        c.setFont("HK-Sans-Bold", 8)
        c.drawString(x + 7 * mm, y + 43 * mm, n)
        c.setFont("HK-Sans-Bold", 11)
        c.drawString(x + 7 * mm, y + 31 * mm, title)
        para(c, body, x + 7 * mm, y + 25 * mm, cw - 14 * mm, size=8.3, leading=11.4, color=color, gap=0)
    page_mark(c, no, label)
    c.showPage()


def layers_page(c: Canvas, no: int, label: str, section: dict[str, Any]) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    x = 18 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, W - 36 * mm, size=30, leading=31, color=WHITE)
    y = para(c, section["lead"], x, y - 6 * mm, W - 36 * mm, size=10.6, leading=14.8, color=WHITE, font="HK-Serif-Bold")
    if section.get("body"):
        para(c, section["body"][0], x, y, W - 36 * mm, size=8.3, leading=11.6, color=WHITE, gap=0)
    cols = section.get("columns", [])
    cw = (W - 42 * mm) / 3
    for i, (title, body) in enumerate(cols):
        cx = x + i * (cw + 3 * mm)
        c.setFillColor([PINK, INK, ACID][i])
        c.roundRect(cx, 30 * mm, cw, 112 * mm, 4 * mm, stroke=0, fill=1)
        draw_crop(c, image_path(["kresba-vrstvy.webp", "umlcena-tvar.webp", "temny-lustr.webp"][i]),
                  cx, 86 * mm, cw, 56 * mm, radius=4 * mm)
        color = INK if i == 2 else WHITE
        c.setFillColor(color)
        c.setFont("HK-Sans-Bold", 12)
        c.drawString(cx + 6 * mm, 74 * mm, title)
        para(c, body, cx + 6 * mm, 68 * mm, cw - 12 * mm, size=8.4, leading=11.8, color=color, gap=0)
    page_mark(c, no, label, dark=True)
    c.showPage()


def sound_page(c: Canvas, no: int, label: str, cfg: dict[str, Any]) -> None:
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("temny-lustr-extreme-optimized.webp"), 0, H - 118 * mm, W, 113 * mm)
    c.setFillColor(PINK)
    c.rect(0, H - 121 * mm, W, 3 * mm, stroke=0, fill=1)
    c.setFillColor(ACID)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(18 * mm, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, cfg["sound_title"], 18 * mm, 155 * mm, W - 36 * mm, size=29, leading=31, color=WHITE)
    col_w = (W - 42 * mm) / 2
    for i, p in enumerate(cfg["sound"]):
        para(c, p, 18 * mm + i * (col_w + 6 * mm), y - 8 * mm, col_w,
             size=10, leading=15, color=WHITE)
    page_mark(c, no, label, dark=True)
    c.showPage()


def safety_page(c: Canvas, no: int, label: str, section: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("cerveny-signal-optimized.webp"), W - 72 * mm, 0, 72 * mm, H - 5 * mm)
    x, width = 18 * mm, W - 108 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, width, size=27, leading=29)
    y = para(c, section["lead"], x, y - 6 * mm, width, size=10.8, leading=15.5, font="HK-Serif-Bold")
    for bullet in section["bullets"]:
        c.setFillColor(PINK)
        c.circle(x + 2 * mm, y - 3.3 * mm, 1.2 * mm, stroke=0, fill=1)
        y = para(c, bullet, x + 7 * mm, y, width - 7 * mm, size=8.8, leading=12.5, gap=2.3 * mm)
    c.setFillColor(NAVY)
    c.rect(x, 25 * mm, width, 27 * mm, stroke=0, fill=1)
    para(c, section["note"], x + 6 * mm, 47 * mm, width - 12 * mm, size=8.4, leading=12,
         color=WHITE, font="HK-Serif-Bold", gap=0)
    page_mark(c, no, label)
    c.showPage()


def outcome_page(c: Canvas, no: int, label: str, section: dict[str, Any], cfg: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("zimni-les.webp"), 7 * mm, 16 * mm, 77 * mm, H - 31 * mm, radius=5 * mm)
    x, width = 99 * mm, W - 117 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, width, size=25, leading=27)
    y = para(c, section["lead"], x, y - 6 * mm, width, size=10.6, leading=15.4, font="HK-Serif-Bold")
    for p in section.get("body", []):
        y = para(c, p, x, y, width, size=9.1, leading=13.2, gap=3.2 * mm)
    c.setFillColor(ACID)
    c.roundRect(x, 25 * mm, width, 22 * mm, 4 * mm, stroke=0, fill=1)
    para(c, cfg["funding"], x + 5 * mm, 42 * mm, width - 10 * mm,
         size=6.6, leading=8.5, color=INK, font="HK-Sans-Bold", gap=0)
    page_mark(c, no, label)
    c.showPage()


def author_page(c: Canvas, no: int, label: str, section: dict[str, Any]) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("autor-role.webp"), 0, 0, 79 * mm, H - 5 * mm, focus=(0.52, 0.5))
    x, width = 94 * mm, W - 112 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, width, size=30, leading=31, color=WHITE)
    y = para(c, section["lead"], x, y - 7 * mm, width, size=11, leading=15.7, color=WHITE, font="HK-Serif-Bold")
    for p in section.get("body", []):
        y = para(c, p, x, y, width, size=9.3, leading=13.7, color=WHITE, gap=3.5 * mm)
    c.setFillColor(ACID)
    c.rect(x, 27 * mm, width, 38 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x + 6 * mm, 55 * mm, "VÝBĚR PRÁCE")
    c.setFont("HK-Serif", 8.4)
    c.drawString(x + 6 * mm, 46 * mm, "What The Fact? · Česká televize")
    c.drawString(x + 6 * mm, 38 * mm, "Videoeseje · fotografie · cestovní deníky")
    page_mark(c, no, label, dark=True)
    c.showPage()


def vulnerability_page(c: Canvas, no: int, label: str, cfg: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("autor-metafyzicka-pout.webp"), 0, 0, 94 * mm, H - 5 * mm, focus=(0.5, 0.45))
    x, width = 109 * mm, W - 127 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, cfg["vuln_title"], x, H - 34 * mm, width, size=27, leading=29)
    for p in cfg["vuln"]:
        y = para(c, p, x, y - 5 * mm if p == cfg["vuln"][0] else y, width,
                 size=9.6, leading=14.2, gap=4.5 * mm)
    c.setFillColor(PINK)
    c.rect(x, 29 * mm, width, 47 * mm, stroke=0, fill=1)
    para(c, cfg["vuln_quote"], x + 6 * mm, 66 * mm, width - 12 * mm,
         size=13, leading=18, color=WHITE, font="HK-Serif-Bold", gap=0)
    page_mark(c, no, label)
    c.showPage()


def atlas_page(c: Canvas, no: int, label: str, cfg: dict[str, Any], start: int) -> None:
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(14 * mm, H - 18 * mm, f"{no:02d} · {label}")
    gap = 4 * mm
    cw = (W - 32 * mm - gap) / 2
    ch = (H - 42 * mm - gap) / 2
    for i in range(4):
        col, row = i % 2, i // 2
        x = 14 * mm + col * (cw + gap)
        y = 16 * mm + (1 - row) * (ch + gap)
        draw_crop(c, image_path(ATLAS_IMAGES[start + i]), x, y, cw, ch)
        c.setFillColor(PAPER)
        c.rect(x, y, cw, 22 * mm, stroke=0, fill=1)
        title, caption = cfg["atlas"][start + i]
        c.setFillColor(INK)
        c.setFont("HK-Sans-Bold", 9)
        c.drawString(x + 5 * mm, y + 13 * mm, title)
        c.setFont("HK-Serif", 7.4)
        c.drawString(x + 5 * mm, y + 6 * mm, caption)
    c.showPage()


def works_page(c: Canvas, no: int, label: str, cfg: dict[str, Any], start: int) -> None:
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(14 * mm, H - 18 * mm, f"{no:02d} · {label}")

    gap = 4 * mm
    card_w = (W - 32 * mm - gap) / 2
    card_h = (H - 42 * mm - gap) / 2
    accents = (PINK, ACID, PAPER, NAVY)
    textures = (
        "organicky-povrch.webp",
        "kresba-vrstvy.webp",
        "sklenene-oko.webp",
        "cerveny-signal-optimized.webp",
    )

    for index in range(4):
        col, row = index % 2, index // 2
        x = 14 * mm + col * (card_w + gap)
        y = 16 * mm + (1 - row) * (card_h + gap)
        accent = accents[index]
        c.setFillColor(PAPER)
        c.roundRect(x, y, card_w, card_h, 4 * mm, stroke=0, fill=1)
        draw_crop(
            c,
            image_path(textures[index]),
            x,
            y + card_h - 31 * mm,
            card_w,
            31 * mm,
            radius=4 * mm,
        )
        c.setFillColor(accent)
        c.rect(x, y + card_h - 35 * mm, card_w, 4 * mm, stroke=0, fill=1)
        title, description = cfg["works"][start + index]
        title_y = heading(
            c,
            title,
            x + 6 * mm,
            y + card_h - 43 * mm,
            card_w - 12 * mm,
            size=10.4,
            leading=12.2,
            color=INK,
        )
        para(
            c,
            description,
            x + 6 * mm,
            title_y - 4 * mm,
            card_w - 12 * mm,
            size=8.1,
            leading=11.6,
            color=INK,
            gap=0,
        )
    c.showPage()


def sources_page(c: Canvas, no: int, label: str, section: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("brutalistni-okulus.webp"), W - 67 * mm, 0, 67 * mm, H - 5 * mm)
    x, width = 18 * mm, W - 104 * mm
    c.setFillColor(PINK)
    c.setFont("HK-Sans-Bold", 8)
    c.drawString(x, H - 22 * mm, f"{no:02d} · {label}")
    y = heading(c, section["title"], x, H - 34 * mm, width, size=26, leading=28)
    y = para(c, section["lead"], x, y - 6 * mm, width, size=10.5, leading=15, font="HK-Serif-Bold")
    for i, source in enumerate(section["sources"], 1):
        c.setFillColor(PINK)
        c.setFont("HK-Sans-Bold", 7.4)
        c.drawString(x, y - 2 * mm, f"{i:02d}")
        y = para(c, source, x + 9 * mm, y, width - 9 * mm, size=8.2, leading=11.5, gap=2.6 * mm)
    if section.get("note") and y > 30 * mm:
        c.setFillColor(NAVY)
        c.roundRect(x, 22 * mm, width, 22 * mm, 4 * mm, stroke=0, fill=1)
        para(c, section["note"], x + 5 * mm, 39 * mm, width - 10 * mm, size=7.4, leading=10.4,
             color=WHITE, font="HK-Serif-Bold", gap=0)
    page_mark(c, no, label)
    c.showPage()


def closing_page(c: Canvas, lang: str, no: int, label: str, cfg: dict[str, Any]) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_crop(c, image_path("drevo-telo.webp"), 0, 0, W, H, focus=(0.55, 0.5))
    c.setFillColor(Color(0.03, 0.05, 0.07, alpha=0.86))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_logo(c, lang, 20 * mm, H - 105 * mm, 62 * mm)
    c.setFillColor(WHITE)
    y = heading(c, cfg["closing"], 20 * mm, H - 125 * mm, W - 40 * mm, size=27, leading=30, color=WHITE)
    c.setFillColor(ACID)
    c.rect(20 * mm, y - 18 * mm, 78 * mm, 1.5 * mm, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("HK-Sans-Bold", 11)
    c.drawString(20 * mm, y - 33 * mm, "stepanchalupa@post.cz")
    c.setFont("HK-Sans", 9)
    c.drawString(20 * mm, y - 45 * mm, "+420 728 568 913")
    c.drawString(20 * mm, y - 56 * mm, "husi-kuze.felleanuvpruvodce.workers.dev")
    if cfg.get("feedback"):
        c.setFillColor(NAVY)
        c.roundRect(20 * mm, 38 * mm, W - 40 * mm, 47 * mm, 4 * mm, stroke=0, fill=1)
        c.setFillColor(ACID)
        c.setFont("HK-Sans-Bold", 7.2)
        c.drawString(26 * mm, 76 * mm, cfg["feedback_title"])
        feedback_y = 69 * mm
        for item in cfg["feedback"]:
            c.setFillColor(PINK)
            c.circle(27 * mm, feedback_y - 2.4 * mm, 1 * mm, stroke=0, fill=1)
            feedback_y = para(
                c,
                item,
                32 * mm,
                feedback_y,
                W - 58 * mm,
                size=7.4,
                leading=9.6,
                color=WHITE,
                gap=1.2 * mm,
            )
    c.setFillColor(PINK)
    c.rect(20 * mm, 20 * mm, 69 * mm, 11 * mm, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("HK-Sans-Bold", 8)
    c.drawCentredString(54.5 * mm, 24 * mm, "18+ · WORK IN PROGRESS")
    page_mark(c, no, label, dark=True)
    c.showPage()


def build(lang: str) -> Path:
    cfg = EXTRA[lang]
    base = BASE[lang]
    sections = base["sections"]
    out = OUT / cfg["file"]
    c = Canvas(str(out), pagesize=A4, pageCompression=1)
    c.setTitle(f"{base['title']} · {cfg['version']}")
    c.setAuthor("Štěpán Chalupa")
    labels = cfg["labels"]

    cover(c, lang, cfg)                                       # 01
    draw_body_page(c, 2, labels[0], sections[0], "sklenene-oko.webp", cfg)  # 02
    why_page(c, 3, labels[1], sections[6], cfg)               # 03
    reclaim_page(c, 4, labels[2], cfg)                        # 04
    process_page(c, 5, labels[3], sections[3])                # 05
    cards_page(c, 6, labels[4], sections[1])                  # 06
    draw_body_page(c, 7, labels[5], sections[5], "umlcena-tvar.webp", cfg)  # 07
    layers_page(c, 8, labels[6], sections[2])                 # 08
    sound_page(c, 9, labels[7], cfg)                          # 09
    safety_page(c, 10, labels[8], sections[4])                # 10
    outcome_page(c, 11, labels[9], sections[7], cfg)          # 11
    author_page(c, 12, labels[10], sections[8])               # 12
    vulnerability_page(c, 13, labels[11], cfg)                # 13
    atlas_page(c, 14, labels[12], cfg, 0)                     # 14
    works_page(c, 15, labels[13], cfg, 0)                     # 15
    works_page(c, 16, labels[14], cfg, 4)                     # 16
    sources_page(c, 17, labels[15], sections[9])              # 17
    closing_page(c, lang, 18, labels[16], cfg)                # 18
    c.save()
    return out


if __name__ == "__main__":
    for language in ("cs", "en", "uk"):
        print(build(language))
