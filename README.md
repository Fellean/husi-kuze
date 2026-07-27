# Husí kůže

Veřejný web autorského projektu Štěpána Chalupy. Produkční web běží jako
Cloudflare Worker a jeho zdroj je tento repozitář.

## Vizuální editor

Ve Windows spusť dvojklikem `START_EDITOR.bat`. Otevře se lokální editor na
`http://127.0.0.1:8765`.

Editor je vizuální:

- kliknutím upravíš názvy, popisky a text článku přímo v náhledu,
- tažením změníš pořadí kategorií, fotek, článků a kapitol,
- obrázek přidáš běžným výběrem souboru,
- `Uložit rozepsané` zapíše změnu jen do počítače,
- `Uložit a publikovat` vytvoří Git commit a odešle jej na GitHub.

Editor běží pouze na `127.0.0.1`, není součástí veřejného webu a neukládá
žádné heslo ani GitHub token. Pro publikování musí být počítač jednou
přihlášený ke GitHubu, nejjednodušeji přes GitHub Desktop.

## Automatické nasazení na stávající Cloudflare Worker

V Cloudflare otevři Worker `husi-kuze` a v `Settings → Builds` připoj
repozitář `Fellean/husi-kuze`. Nastavení:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npm run deploy:worker`
- Root directory: `/`
- Node.js: 22

Od té chvíle každý push do `main` automaticky vytvoří a nasadí novou verzi na
stávající adresu Workeru. Není potřeba ručně nahrávat ZIP ani kopírovat HTML.

## Vlastní doména

Adresa `husi-kuze.felleanuvpruvodce.workers.dev` obsahuje název Workeru a
Cloudflare účetní subdoménu. Druhou část nelze u `workers.dev` skrýt.

Pro čistou adresu je potřeba koupit `husikuze.com`, přidat ji jako aktivní
Cloudflare zónu a u Workeru otevřít:

`Settings → Domains & Routes → Add → Custom Domain`

Jako doménu zadej `husikuze.com`. Pro `www.husikuze.com` je vhodné přidat
přesměrování na kořenovou doménu.

## Lokální vývoj

```bash
npm install
npm run dev
```

Kontroly:

```bash
npm run lint
npm test
```

Ruční nasazení:

```bash
npm run deploy
```
