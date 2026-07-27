# Husí kůže

Samostatný web projektu Husí kůže pro vlastní Cloudflare účet. GitHub drží
zdrojový kód a Cloudflare Worker po každém pushi web automaticky sestaví a
zveřejní.

Online editor je součástí webu na `/editor`. Texty, odkazy a obrázky se
ukládají do SQLite úložiště uvnitř stejného Cloudflare Workeru. Není potřeba
samostatně vytvářet D1 databázi, R2 bucket ani opisovat jejich identifikátory do
repozitáře.

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

Cloudflare si při prvním deployi samo založí interní SQLite úložiště
`HusiKuzeCms`. Další push do `main` už jen automaticky aktualizuje web a
uložený obsah editoru zachová.

## Lokální kontrola

```bash
npm ci
npm test
```

Pro lokální editor vytvoř `.dev.vars` s řádkem
`ADMIN_PASSWORD=lokalni-heslo-alespon-12-znaku` a spusť `npm run dev`.
