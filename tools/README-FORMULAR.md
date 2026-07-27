# Google Formulář

Připojení Google Drive neumí měnit otázky a obrázky uvnitř Google Forms.
Soubor `google-form-rebuild.gs` proto používá oficiální Google Apps Script.

Skript:

- nejdřív vytvoří záložní kopii původního formuláře,
- zachová původní formulář a jeho URL,
- vytvoří pět krátkých větví podle pozice odpovídajícího,
- ponechá povinné jen dvě zásadní otázky,
- nechá jméno i kontakt nepovinné,
- oddělí účast, odmítnutí, nejistotu a spolupráci,
- odmítnutí nevede do dalšího náboru.

Tři úzké fotografie lze přidat přes `STRIP_IMAGE_FILE_IDS`. Obrázky musí být
předem oříznuté na nízké vodorovné proužky; Google Forms neumí spolehlivě
oříznout vysokou fotografii pouhým nastavením šířky.
