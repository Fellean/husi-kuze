/**
 * Jednorázová přestavba formuláře Husí kůže.
 *
 * Spuštění:
 * 1. Otevři https://script.google.com a vytvoř nový projekt.
 * 2. Vlož tento soubor a spusť rebuildHusiKuzeForm().
 * 3. Potvrď přístup k Formulářům a Disku.
 *
 * Skript nejdřív vytvoří záložní kopii a až potom přestaví původní formulář.
 */

const FORM_ID = "1KLSA6G1r56sNfttj9TEaikH4jMwby3udJKYCDBL6XeM";

// Volitelné: sem vlož ID tří PŘEDEM OŘÍZNUTÝCH úzkých proužků z Disku.
// Prázdné pole znamená formulář bez velkých dekorativních fotografií.
const STRIP_IMAGE_FILE_IDS = [];

function addStrip_(form, index) {
  const fileId = STRIP_IMAGE_FILE_IDS[index];
  if (!fileId) return;
  form
    .addImageItem()
    .setImage(DriveApp.getFileById(fileId).getBlob())
    .setAlignment(FormApp.Alignment.CENTER)
    .setWidth(900);
}

function addOptionalContact_(form) {
  form
    .addTextItem()
    .setTitle("Kontakt, pokud chceš odpověď nebo se chceš zapojit")
    .setHelpText("Nepovinné. Můžeš uvést e-mail, telefon, Instagram, Signal nebo jinou cestu.")
    .setRequired(false);
  form
    .addTextItem()
    .setTitle("Jak ti máme nejraději odpovědět?")
    .setHelpText("Nepovinné. Napiš například e-mail, zpráva na IG, telefon nebo Signal.")
    .setRequired(false);
}

function rebuildHusiKuzeForm() {
  const formFile = DriveApp.getFileById(FORM_ID);
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH-mm");
  formFile.makeCopy(`ZÁLOHA · ${formFile.getName()} · ${stamp}`);

  const form = FormApp.openById(FORM_ID);
  form.getItems().forEach((item) => form.deleteItem(item));

  form
    .setTitle("Husí kůže · zájem, otázky, spolupráce a zpětná vazba")
    .setDescription(
      "Jeden vstup pro veřejnost, oslovené lidi i možné spolupracující. " +
      "Nemusíš se rozhodnout pro účast a nemusíš vysvětlovat odmítnutí. " +
      "Povinné jsou jen dvě položky: z jaké pozice odpovídáš a potvrzení, " +
      "že rozumíš tomu, jak s odpovědí naložíme. Kontakt je vždy nepovinný."
    )
    .setConfirmationMessage(
      "Díky. Odpověď nic neslibuje a nevytváří souhlas s natáčením. " +
      "Pokud jsi nechal/a kontakt, ozveme se pouze k tomu, co jsi sám/sama otevřel/a."
    )
    .setProgressBar(true)
    .setShuffleQuestions(false)
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false);

  addStrip_(form, 0);
  form
    .addSectionHeaderItem()
    .setTitle("Začni tam, kde právě jsi")
    .setHelpText(
      "Odmítnutí je konečná a platná odpověď. Nejistota není pozvánka k přesvědčování. " +
      "Zájem o konzultaci nebo spolupráci není automaticky zájem být před kamerou."
    );

  const position = form
    .addMultipleChoiceItem()
    .setTitle("Z jaké pozice odpovídáš?")
    .setHelpText("Povinné. Podle odpovědi se zobrazí jen relevantní krátká větev.")
    .setRequired(true);

  const publicPage = form
    .addPageBreakItem()
    .setTitle("Jsem z veřejnosti")
    .setHelpText("Můžeš položit otázku, nabídnout pohled nebo jen napsat, co v tobě projekt otevřel.");
  form
    .addCheckboxItem()
    .setTitle("Co tě přivedlo?")
    .setChoiceValues([
      "Téma doteku, těla nebo blízkosti",
      "Filmová a obrazová forma",
      "Etika, souhlas nebo anonymita",
      "Autorský příběh",
      "Náhoda / doporučení",
    ])
    .setRequired(false);
  form
    .addParagraphTextItem()
    .setTitle("Co bys chtěl/a projektu říct nebo na co se zeptat?")
    .setRequired(false);

  addStrip_(form, 1);
  const interestedPage = form
    .addPageBreakItem()
    .setTitle("Byl/a jsem osloven/a a účast mě zajímá")
    .setHelpText("Tohle není souhlas s natáčením. Jen mapujeme, jaký další krok by byl příjemný.");
  form
    .addCheckboxItem()
    .setTitle("Co je ti teď nejbližší?")
    .setChoiceValues([
      "Nezávazná schůzka bez kamery",
      "Nejdřív si přečíst přesnější koncept",
      "Položit otázky písemně",
      "Uvažovat o portrétu před kamerou",
      "Zapojit se jen hlasem, konzultací nebo jinak mimo obraz",
    ])
    .setRequired(false);
  form
    .addParagraphTextItem()
    .setTitle("Co bys potřeboval/a vědět nebo mít zajištěné, aby další krok dával smysl?")
    .setHelpText("Může jít o přístupnost, anonymitu, doprovod, místo, čas, hranice nebo cokoli jiného.")
    .setRequired(false);

  const unsurePage = form
    .addPageBreakItem()
    .setTitle("Byl/a jsem osloven/a a zatím nevím")
    .setHelpText("Nejistotu nebudeme číst jako souhlas ani jako výzvu k nátlaku.");
  form
    .addCheckboxItem()
    .setTitle("Co by ti pomohlo udělat si jasno?")
    .setChoiceValues([
      "Stručnější vysvětlení projektu",
      "Konkrétní ukázka plánovaného portrétu",
      "Informace o souhlasu a schvalování střihu",
      "Nezávazný rozhovor bez kamery",
      "Čas bez dalšího kontaktování",
    ])
    .setRequired(false);
  form
    .addParagraphTextItem()
    .setTitle("Je něco konkrétního, co v tobě budí otázku nebo obavu?")
    .setRequired(false);

  const refusalPage = form
    .addPageBreakItem()
    .setTitle("Byl/a jsem osloven/a a nechci se zapojit")
    .setHelpText("Díky za jasnou odpověď. Odmítnutí nemusíš zdůvodňovat a nebude následovat další nábor.");
  form
    .addCheckboxItem()
    .setTitle("Pokud chceš, co bychom měli do budoucna dělat lépe?")
    .setChoiceValues([
      "Jasněji oddělit účast, konzultaci a spolupráci",
      "Méně informací v prvním oslovení",
      "Citlivěji formulovat tělo, nahotu nebo intimitu",
      "Dát víc času a méně navazujících zpráv",
      "Lépe vysvětlit bezpečí, anonymitu a střih",
    ])
    .setRequired(false);
  form
    .addParagraphTextItem()
    .setTitle("Je ještě něco, co chceš, abychom slyšeli?")
    .setRequired(false);

  addStrip_(form, 2);
  const collaborationPage = form
    .addPageBreakItem()
    .setTitle("Nabízím konzultaci, spolupráci, prostor nebo podporu")
    .setHelpText("Spolupráce není totéž co účast před kamerou.");
  form
    .addCheckboxItem()
    .setTitle("Co nabízíš nebo hledáš?")
    .setChoiceValues([
      "Odbornou konzultaci",
      "Kameru, zvuk, střih nebo jinou tvůrčí spolupráci",
      "Prostor pro natáčení, projekci nebo výstavu",
      "Produkční, institucionální nebo finanční podporu",
      "Propojení s lidmi či organizací",
    ])
    .setRequired(false);
  form
    .addParagraphTextItem()
    .setTitle("Popiš prosím stručně nabídku, otázku nebo nápad")
    .setRequired(false);

  const finalPage = form
    .addPageBreakItem()
    .setTitle("Kontakt a poslední potvrzení")
    .setHelpText("Kontakt nech jen tehdy, pokud chceš odpověď. Formulář není souhlas s natáčením.");
  form
    .addTextItem()
    .setTitle("Jméno nebo přezdívka")
    .setHelpText("Nepovinné.")
    .setRequired(false);
  addOptionalContact_(form);
  form
    .addCheckboxItem()
    .setTitle("Jak smíme s odpovědí naložit?")
    .setChoiceValues([
      "Rozumím, že odpověď použije malý tým projektu pouze pro reakci, plánování a zlepšování projektu. Zveřejnění citace nebo citlivého obsahu by vyžadovalo nový, konkrétní souhlas.",
    ])
    .setRequired(true);

  position.setChoices([
    position.createChoice("Jsem z veřejnosti / chci položit otázku nebo dát zpětnou vazbu", publicPage),
    position.createChoice("Byl/a jsem osloven/a a účast mě zajímá", interestedPage),
    position.createChoice("Byl/a jsem osloven/a a zatím nevím", unsurePage),
    position.createChoice("Byl/a jsem osloven/a a nechci se zapojit", refusalPage),
    position.createChoice("Nabízím konzultaci, spolupráci, prostor nebo podporu", collaborationPage),
  ]);

  publicPage.setGoToPage(finalPage);
  interestedPage.setGoToPage(finalPage);
  unsurePage.setGoToPage(finalPage);
  refusalPage.setGoToPage(finalPage);
  collaborationPage.setGoToPage(finalPage);
  finalPage.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  Logger.log(`Upraveno: ${form.getEditUrl()}`);
  Logger.log(`Odpovědi: ${form.getPublishedUrl()}`);
}
