import type { Locale } from "../i18n";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/1KLSA6G1r56sNfttj9TEaikH4jMwby3udJKYCDBL6XeM/viewform";

const copy = {
  cs: {
    label: "Nezávazný formulář",
    title: "Jedno místo pro otázku, zájem, spolupráci i poctivé ne.",
    text: "Tohle není přihláška ani souhlas s natáčením. Je to rozcestník pro veřejnost, oslovené lidi, možné účastnictvo i spolupracující. Povinné mají zůstat jen dvě věci: z jaké pozice přicházíš a potvrzení, že odpověď nic neslibuje. Všechno osobní je dobrovolné.",
    note: "Kontakt je nepovinný. Může to být e-mail, telefon, Instagram nebo cokoli, přes co si přeješ odpověď. Bez kontaktu zůstane odpověď anonymní zpětnou vazbou.",
    routes: [
      ["Veřejnost", "Mám otázku, názor nebo chci projekt jen sledovat."],
      ["Oslovený/á · přijímám", "Chci navázat a domluvit nezávazný další krok."],
      ["Oslovený/á · váhám", "Potřebuji vysvětlení, čas nebo konkrétní podmínku."],
      ["Oslovený/á · odmítám", "Mohu odmítnout bez vysvětlování; zpětná vazba je dobrovolná."],
      ["Spolupráce / podpora", "Nabízím odbornost, prostor, produkci nebo jinou pomoc."],
    ],
    questions: [
      ["Povinné", "Z jaké pozice přicházíš?", "veřejnost · zájem · váhání · odmítnutí · spolupráce / podpora"],
      ["Nepovinné", "Co chceš říct, zjistit nebo zpochybnit?", "jedno otevřené pole místo výslechu"],
      ["Nepovinné", "Co by další kontakt udělalo přístupnější?", "čas · otázky předem · online · klidné místo · doprovod · bezbariérovost"],
      ["Nepovinné", "Co v oslovení fungovalo a co bylo nepříjemné?", "pro lidi, kteří už zprávu dostali – bez povinnosti ji hodnotit"],
      ["Nepovinné", "Kam můžu odpovědět?", "e-mail · telefon · Instagram · jiný kontakt"],
      ["Povinné", "Rozumím, že formulář není souhlas s natáčením.", "žádná odpověď sama o sobě nezakládá účast"],
    ],
    iframe: "Husí kůže – zájem, otázky, spolupráce a zpětná vazba",
    fallback: "Otevřít formulář v nové kartě ↗",
  },
  en: {
    label: "No-obligation form",
    title: "One place for a question, interest, collaboration or an honest no.",
    text: "This is neither an application nor consent to filming. It is a shared entrance for the public, people who were contacted, possible participants and collaborators. Only your point of entry and acknowledgement that the response commits you to nothing should be required. Everything personal is optional.",
    note: "Contact details are optional. You may leave an email, phone number, Instagram account or any channel where you want a reply. Without one, the response remains anonymous feedback.",
    routes: [
      ["Public", "I have a question, an opinion, or simply want to follow the project."],
      ["Contacted · yes", "I want to continue and agree on a no-obligation next step."],
      ["Contacted · unsure", "I need clarification, time, or a specific condition."],
      ["Contacted · no", "I may refuse without explaining; feedback is optional."],
      ["Collaboration / support", "I offer expertise, space, production or another form of help."],
    ],
    questions: [
      ["Required", "Where are you coming from?", "public · interested · unsure · declining · collaboration / support"],
      ["Optional", "What would you like to say, ask or challenge?", "one open field instead of an interrogation"],
      ["Optional", "What would make further contact more accessible?", "time · questions in advance · online · quiet place · companion · accessibility"],
      ["Optional", "What worked in the invitation and what felt uncomfortable?", "for people already contacted, with no duty to review it"],
      ["Optional", "Where may I reply?", "email · phone · Instagram · another contact"],
      ["Required", "I understand that this form is not consent to filming.", "no answer creates an obligation to participate"],
    ],
    iframe: "Goosebumps – interest, questions, collaboration and feedback",
    fallback: "Open the form in a new tab ↗",
  },
  uk: {
    label: "Форма без зобов’язань",
    title: "Одне місце для запитання, зацікавлення, співпраці або чесного «ні».",
    text: "Це не заявка і не згода на зйомку. Це спільний вхід для громадськості, запрошених людей, можливих учасників і співпрацівників. Обов’язковими мають бути лише позиція, з якої людина відповідає, та підтвердження, що відповідь ні до чого не зобов’язує. Усе особисте — добровільне.",
    note: "Контакт необов’язковий. Можна залишити e-mail, телефон, Instagram або інший канал, куди ти хочеш отримати відповідь. Без контакту відповідь залишиться анонімним відгуком.",
    routes: [
      ["Громадськість", "Маю запитання, думку або просто хочу стежити за проєктом."],
      ["Запрошена людина · так", "Хочу продовжити й узгодити наступний крок без зобов’язань."],
      ["Запрошена людина · вагаюся", "Потребую пояснення, часу або конкретної умови."],
      ["Запрошена людина · ні", "Можу відмовитися без пояснення; відгук добровільний."],
      ["Співпраця / підтримка", "Пропоную фаховість, простір, продакшн чи іншу допомогу."],
    ],
    questions: [
      ["Обов’язково", "З якої позиції ти відповідаєш?", "громадськість · зацікавлення · сумнів · відмова · співпраця / підтримка"],
      ["Необов’язково", "Що ти хочеш сказати, запитати або поставити під сумнів?", "одне відкрите поле замість допиту"],
      ["Необов’язково", "Що зробить подальший контакт доступнішим?", "час · запитання заздалегідь · онлайн · тихе місце · супровід · безбар’єрність"],
      ["Необов’язково", "Що в запрошенні спрацювало, а що було неприємним?", "для вже запрошених людей, без обов’язку оцінювати"],
      ["Необов’язково", "Куди можна відповісти?", "e-mail · телефон · Instagram · інший контакт"],
      ["Обов’язково", "Я розумію, що форма не є згодою на зйомку.", "жодна відповідь не створює обов’язку брати участь"],
    ],
    iframe: "Гусяча шкіра – зацікавлення, запитання, співпраця та відгуки",
    fallback: "Відкрити форму в новій вкладці ↗",
  },
} as const;

export default function ProjectForm({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="embeddedForm">
      <div className="embeddedFormIntro">
        <p className="sectionLabel">{c.label}</p>
        <h2 id="form-title">{c.title}</h2>
        <p>{c.text}</p>
        <div className="formRoutes">
          {c.routes.map(([title, description]) => (
            <div key={title}>
              <strong>{title}</strong>
              <span>{description}</span>
            </div>
          ))}
        </div>
        <div className="formQuestionMap" aria-label={c.label}>
          {c.questions.map(([status, question, detail], index) => (
            <div data-required={index === 0 || index === c.questions.length - 1} key={question}>
              <span>{status}</span>
              <strong>{question}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
        <p className="embeddedFormNote">{c.note}</p>
      </div>
      <div className="formLaunchCard">
        <div className="formImageStrips" aria-hidden="true">
          <img src="/gallery/ty-to-zvladnes-rukopis.webp" alt="" loading="lazy" decoding="async" />
          <img src="/gallery/drevo-telo.webp" alt="" loading="lazy" decoding="async" />
          <img src="/gallery/sklenene-oko-extreme-optimized.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="formLaunchCopy">
          <span>{c.label}</span>
          <strong>{c.iframe}</strong>
          <p>{c.note}</p>
          <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer">
            {c.fallback}
          </a>
          <small>
            {locale === "cs"
              ? "Otevře se samostatně, bez nepříjemného scrollu uvnitř stránky."
              : locale === "uk"
                ? "Форма відкриється окремо, без незручного прокручування всередині сторінки."
                : "It opens separately, without an awkward scroll inside the page."}
          </small>
        </div>
      </div>
    </div>
  );
}
