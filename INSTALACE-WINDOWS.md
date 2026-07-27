# Husí kůže · první nastavení ve Windows

## 1. Dostat novou verzi do GitHubu

1. Nainstaluj [GitHub Desktop](https://desktop.github.com/).
2. Přihlas se a naklonuj repozitář `Fellean/husi-kuze`.
3. Rozbal obsah předaného ZIPu přímo do naklonované složky a potvrď nahrazení souborů.
4. V GitHub Desktopu zvol větev `main`, napiš například `Přidat vizuální editor`
   a klikni na `Commit to main`.
5. Klikni na `Push origin`.

Od této chvíle už se celý balíček znovu nekopíruje.

## 2. Jednou propojit Cloudflare

U Workeru `husi-kuze` otevři `Settings → Builds` a připoj
`Fellean/husi-kuze`.

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npm run deploy:worker`
- Root directory: `/`
- Node.js: `22`

## 3. Běžná úprava webu

1. V naklonované složce spusť dvojklikem `START_EDITOR.bat`.
2. V editoru klikni přímo do textu, přesuň kartu nebo přidej obrázek.
3. Klikni na `Uložit a publikovat`.

Editor vytvoří commit a push do GitHubu. Cloudflare po pushi automaticky
sestaví a nasadí novou verzi.

Pokud GitHub změnu poprvé odmítne, otevři GitHub Desktop a zkontroluj, že
jsi přihlášený k účtu `Fellean`. Editor používá stejné bezpečné přihlášení;
žádné heslo ani token si neukládá.

## 4. Google Formulář

Soubor `tools/google-form-rebuild.gs` je jednorázový skript pro Google Apps
Script. Nejdřív vytvoří zálohu a potom přestaví původní formulář na pět
krátkých větví. Podrobný postup je v `tools/README-FORMULAR.md`.
