# Husí kůže

Veřejný web nezávislého autorského projektu Štěpána Chalupy.

## Úprava článků bez kódu

1. Otevři https://app.pagescms.org a přihlas se přes GitHub.
2. Nainstaluj Pages CMS pro repozitář `Fellean/husi-kuze`.
3. Otevři sekci **Články a makrostudie**.
4. Uprav nebo přidej text, obraz a zdroje a změnu ulož.

Pages CMS zapisuje obsah do `content/essays.json`. Cloudflare po každé uložené
změně web automaticky znovu sestaví.

## Bezplatné nasazení na Cloudflare Pages

V Cloudflare vyber **Workers & Pages → Create → Pages → Connect to Git** a
repozitář `Fellean/husi-kuze`. Nastav:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist/client`
- Root directory: `/`
- Node.js: 22

Po prvním sestavení dostane web adresu ve tvaru `husi-kuze.pages.dev`.

## Lokální spuštění

```bash
npm install
npm run dev
```

Produkční kontrola:

```bash
npm run build
```
