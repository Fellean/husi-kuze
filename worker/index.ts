/** Cloudflare Worker entry point with self-contained persistent storage. */
import { DurableObject } from "cloudflare:workers";
import handler from "vinext/server/app-router-entry";

type PatchKind = "text" | "href" | "src" | "alt";

type CmsPatch = {
  key: string;
  kind: PatchKind;
  value: string;
};

interface Env {
  ASSETS: Fetcher;
  CMS: DurableObjectNamespace;
  ADMIN_PASSWORD: string;
  OPENAI_API_KEY?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const allowedLocales = new Set(["cs", "en", "uk"]);
const allowedKinds = new Set<PatchKind>(["text", "href", "src", "alt"]);
const maxMediaBytes = 1_750_000;

function validPatch(value: unknown): value is CmsPatch {
  if (!value || typeof value !== "object") return false;
  const patch = value as Record<string, unknown>;
  return (
    typeof patch.key === "string" &&
    patch.key.length > 0 &&
    patch.key.length <= 500 &&
    typeof patch.kind === "string" &&
    allowedKinds.has(patch.kind as PatchKind) &&
    typeof patch.value === "string" &&
    patch.value.length <= 20_000
  );
}

function json(value: unknown, init?: ResponseInit) {
  return Response.json(value, {
    ...init,
    headers: {
      "cache-control": "no-store",
      ...init?.headers,
    },
  });
}

/**
 * One SQLite-backed Durable Object stores editor text, uploaded images and
 * login throttling. Cloudflare provisions it during the first Git deploy, so
 * the repository needs no account-specific D1 or R2 identifiers.
 */
export class HusiKuzeCms extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS cms_patches (
          locale TEXT NOT NULL,
          key TEXT NOT NULL,
          kind TEXT NOT NULL,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (locale, key, kind)
        )
      `);
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS cms_media (
          key TEXT PRIMARY KEY,
          mime TEXT NOT NULL,
          original_name TEXT NOT NULL,
          etag TEXT NOT NULL,
          bytes BLOB NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS login_attempts (
          ip TEXT PRIMARY KEY,
          attempts INTEGER NOT NULL,
          window_start INTEGER NOT NULL
        )
      `);
    });
  }

  private async patches(request: Request, url: URL) {
    if (request.method === "GET") {
      const locale = url.searchParams.get("locale") ?? "cs";
      if (!allowedLocales.has(locale)) {
        return json({ error: "Unsupported locale." }, { status: 400 });
      }

      const rows = Array.from(
        this.ctx.storage.sql.exec<CmsPatch>(
          "SELECT key, kind, value FROM cms_patches WHERE locale = ? ORDER BY key, kind",
          locale,
        ),
      );
      return json({ patches: rows });
    }

    if (request.method !== "PUT") {
      return new Response("Method not allowed.", { status: 405 });
    }

    let payload: { locale?: string; patches?: unknown[] };
    try {
      payload = (await request.json()) as typeof payload;
    } catch {
      return json({ error: "Invalid request." }, { status: 400 });
    }

    const locale = payload.locale ?? "";
    const patches = payload.patches ?? [];
    if (!allowedLocales.has(locale)) {
      return json({ error: "Unsupported locale." }, { status: 400 });
    }
    if (
      !Array.isArray(patches) ||
      patches.length > 1_000 ||
      !patches.every(validPatch)
    ) {
      return json({ error: "Invalid patch list." }, { status: 400 });
    }

    const now = new Date().toISOString();
    this.ctx.storage.transactionSync(() => {
      for (const patch of patches) {
        this.ctx.storage.sql.exec(
          `INSERT INTO cms_patches (locale, key, kind, value, updated_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(locale, key, kind)
           DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
          locale,
          patch.key,
          patch.kind,
          patch.value,
          now,
        );
      }
    });
    return json({ saved: patches.length, updatedAt: now });
  }

  private async media(request: Request, url: URL) {
    if (request.method === "GET") {
      const key = url.searchParams.get("key") ?? "";
      if (!key.startsWith("cms/")) {
        return new Response("Not found.", { status: 404 });
      }
      const row = this.ctx.storage.sql
        .exec<{
          bytes: ArrayBuffer;
          etag: string;
          mime: string;
        }>("SELECT bytes, etag, mime FROM cms_media WHERE key = ?", key)
        .toArray()[0];
      if (!row) return new Response("Not found.", { status: 404 });

      return new Response(row.bytes, {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
          "content-type": row.mime,
          etag: `"${row.etag}"`,
          "x-content-type-options": "nosniff",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed.", { status: 405 });
    }

    const key = request.headers.get("x-storage-key") ?? "";
    const mime = request.headers.get("content-type") ?? "";
    const originalName = (
      request.headers.get("x-original-name") ?? "image"
    ).slice(0, 200);
    if (
      !key.startsWith("cms/") ||
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime)
    ) {
      return json({ error: "Invalid image." }, { status: 400 });
    }

    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > maxMediaBytes) {
      return json({ error: "Image is too large." }, { status: 413 });
    }

    const etag = crypto.randomUUID();
    this.ctx.storage.sql.exec(
      `INSERT INTO cms_media (key, mime, original_name, etag, bytes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      key,
      mime,
      originalName,
      etag,
      bytes,
      new Date().toISOString(),
    );
    return json({ key, etag });
  }

  private async login(request: Request, url: URL) {
    const ip = (url.searchParams.get("ip") ?? "unknown").slice(0, 128);
    if (request.method === "GET") {
      const now = Number(url.searchParams.get("now") ?? "0");
      const windowSeconds = Number(
        url.searchParams.get("windowSeconds") ?? "900",
      );
      const row = this.ctx.storage.sql
        .exec<{ attempts: number; window_start: number }>(
          "SELECT attempts, window_start FROM login_attempts WHERE ip = ?",
          ip,
        )
        .toArray()[0];
      const attempts =
        row && now - row.window_start < windowSeconds ? row.attempts : 0;
      return json({ attempts });
    }

    if (request.method === "DELETE") {
      this.ctx.storage.sql.exec(
        "DELETE FROM login_attempts WHERE ip = ?",
        ip,
      );
      return json({ cleared: true });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed.", { status: 405 });
    }

    let payload: { now?: number; windowSeconds?: number };
    try {
      payload = (await request.json()) as typeof payload;
    } catch {
      payload = {};
    }
    const now = Number(payload.now ?? 0);
    const windowSeconds = Number(payload.windowSeconds ?? 900);
    this.ctx.storage.sql.exec(
      `INSERT INTO login_attempts (ip, attempts, window_start)
       VALUES (?, 1, ?)
       ON CONFLICT(ip) DO UPDATE SET
         attempts = CASE
           WHEN ? - login_attempts.window_start >= ?
           THEN 1 ELSE login_attempts.attempts + 1
         END,
         window_start = CASE
           WHEN ? - login_attempts.window_start >= ?
           THEN ? ELSE login_attempts.window_start
         END`,
      ip,
      now,
      now,
      windowSeconds,
      now,
      windowSeconds,
      now,
    );
    return json({ recorded: true });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/patches") return this.patches(request, url);
    if (url.pathname === "/media") return this.media(request, url);
    if (url.pathname === "/login") return this.login(request, url);
    return new Response("Not found.", { status: 404 });
  }
}

const worker = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
