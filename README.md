# Husí kůže

Samostatný web projektu Husí kůže pro vlastní Cloudflare účet. GitHub drží
zdrojový kód a Cloudflare Worker po každém pushi web automaticky sestaví a
zveřejní.

Online editor je součástí webu na `/editor`. Texty, odkazy a obrázky se
ukládají do SQLite úložiště uvnitř stejného Cloudflare Workeru. Není potřeba
samostatně vytvářet D1 databázi, R2 bucket ani opisovat jejich identifikátory do
repozitáře.

V editaci je vedle přímého přepisování stránky tlačítko **Přidat obsah**.
Otevírá správu nových kategorií galerie, článků a vlastních tlačítek. Nové
články automaticky dostanou adresu `/texty/zvoleny-nazev`, kategorie mohou mít
vlastní nahrané obrázky a u tlačítka lze vybrat umístění, vzhled i otevření v
nové kartě. Vše se ukládá stejným hlavním tlačítkem jako ostatní změny.

## První napojení na Cloudflare

V Cloudflare otevři **Workers & Pages**, zvol **Create application** a
**Import a repository**. Vyber repozitář `Fellean/husi-kuze` a nastav:

- Worker name: `husi-kuze`
- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Po prvním nasazení v nastavení Workeru otevři **Variables & Secrets** a přidej
runtime secret `ADMIN_PASSWORD`. Hodnota musí mít aspoň 12 znaků. To je heslo,
kterým se budeš přihlašovat na `/editor`.

Pro automatický překlad přidej ve stejném místě ještě secret
`OPENAI_API_KEY`. Klíč vytvoříš v OpenAI Platform a jeho použití se účtuje
zvlášť od předplatného ChatGPT. Editor používá úsporný model
`gpt-5.6-luna` a do API posílá jen české texty a alty obrázků změněné od
posledního uložení. Obrázky, heslo ani celý obsah úložiště se neposílají.

V české verzi editoru je překlad ve výchozím stavu zapnutý. Tlačítko
**Uložit + přeložit** uloží češtinu a vytvoří odpovídající změny v EN a UA.
Anglickou i ukrajinskou verzi lze potom dál ručně upravit. Když překlad
selže, česká změna zůstane bezpečně uložená a editor nabídne opakování.

Cloudflare si při prvním deployi samo založí interní SQLite úložiště
`HusiKuzeCms`. Další push do `main` už jen automaticky aktualizuje web a
uložený obsah editoru zachová.

## Lokální kontrola

```bash
npm ci
npm test
```

Pro lokální editor vytvoř `.dev.vars` s řádky
`ADMIN_PASSWORD=lokalni-heslo-alespon-12-znaku` a
`OPENAI_API_KEY=tvuj-api-klic` a spusť `npm run dev`.
