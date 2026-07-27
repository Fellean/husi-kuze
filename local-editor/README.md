# Vizuální editor Husí kůže

Ve Windows spusť `START_EDITOR.bat` v kořeni projektu. Editor automaticky
načte `app/content/site-content.json`; složku už není nutné ručně vybírat.

`Uložit rozepsané` mění pouze lokální soubory. `Uložit a publikovat` uloží
obsah a obrázky, vytvoří Git commit a odešle aktuální větev do GitHubu.
Cloudflare Worker napojený na tuto větev následně spustí nový build.

Pro publikování je potřeba:

1. Git repozitář s remote `origin`.
2. Jednorázové přihlášení ke GitHubu v GitHub Desktopu nebo Git Credential
   Manageru.
3. Cloudflare Worker napojený na `Fellean/husi-kuze`, production branch
   `main`, build `npm run build`, deploy `npm run deploy:worker`.
