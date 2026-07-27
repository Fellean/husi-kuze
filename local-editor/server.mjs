import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const EDITOR_ROOT = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(EDITOR_ROOT, "..");
const CONTENT_PATH = join(PROJECT_ROOT, "app", "content", "site-content.json");
const GALLERY_PATH = join(PROJECT_ROOT, "public", "gallery");
const PORT = Number(process.env.HUSI_EDITOR_PORT || 8765);
const HOST = "127.0.0.1";
const MAX_BODY = 30 * 1024 * 1024;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function json(response, statusCode, value) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(value));
}

async function body(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("Soubor nebo požadavek je příliš velký.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function validateContent(value) {
  if (!value || typeof value !== "object") throw new Error("Obsah nemá platný formát.");
  if (!Array.isArray(value.galleryCategories) || !Array.isArray(value.customArticles)) {
    throw new Error("V obsahu chybí galerie nebo články.");
  }
}

async function saveContent(value) {
  validateContent(value);
  await mkdir(dirname(CONTENT_PATH), { recursive: true });
  const temporary = `${CONTENT_PATH}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, CONTENT_PATH);
}

async function git(args, options = {}) {
  return execFileAsync("git", args, {
    cwd: PROJECT_ROOT,
    timeout: 120_000,
    windowsHide: true,
    maxBuffer: 4 * 1024 * 1024,
    ...options,
  });
}

async function gitStatus() {
  try {
    const [{ stdout: branch }, remote] = await Promise.all([
      git(["branch", "--show-current"]),
      git(["remote", "get-url", "origin"]).catch(() => ({ stdout: "" })),
    ]);
    return {
      isGit: true,
      branch: branch.trim(),
      hasRemote: Boolean(remote.stdout.trim()),
    };
  } catch {
    return { isGit: false, branch: "", hasRemote: false };
  }
}

function safeName(filename) {
  const extension = extname(filename).toLowerCase();
  const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
  if (!allowed.has(extension)) throw new Error("Podporované jsou PNG, JPG, WebP, GIF a AVIF.");
  const base = filename
    .slice(0, -extension.length)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "obraz";
  return `${Date.now()}-${base}${extension}`;
}

async function uploadImage(payload) {
  if (typeof payload.name !== "string" || typeof payload.dataUrl !== "string") {
    throw new Error("Fotka nemá platný název nebo data.");
  }
  const match = payload.dataUrl.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/s);
  if (!match) throw new Error("Fotku se nepodařilo načíst.");
  const bytes = Buffer.from(match[1], "base64");
  if (bytes.length > 20 * 1024 * 1024) throw new Error("Jedna fotka může mít nejvýš 20 MB.");
  const filename = safeName(payload.name);
  await mkdir(GALLERY_PATH, { recursive: true });
  await writeFile(join(GALLERY_PATH, filename), bytes);
  return `/gallery/${filename}`;
}

async function publish(value) {
  await saveContent(value);
  const status = await gitStatus();
  if (!status.isGit) throw new Error("Tahle složka není Git repozitář. Otevři editor z naklonovaného projektu.");
  if (!status.hasRemote) throw new Error("Git repozitář nemá připojený GitHub remote „origin“.");

  await git(["add", "--", "app/content/site-content.json", "public/gallery"]);
  const staged = await git(["diff", "--cached", "--quiet"]).then(() => false).catch((error) => {
    if (error.code === 1) return true;
    throw error;
  });
  if (!staged) {
    return { pushed: false, message: "Na GitHubu už je stejný obsah. Nebylo co publikovat." };
  }

  try {
    await git(["commit", "-m", "Update web content from visual editor"]);
    await git(["push", "origin", `HEAD:${status.branch || "main"}`]);
  } catch (error) {
    const detail = [error.stderr, error.stdout, error.message].filter(Boolean).join("\n").trim();
    throw new Error(
      `Změny jsou uložené, ale GitHub je nepřijal. Otevři repozitář jednou v GitHub Desktopu a přihlas se, potom publikování zopakuj.\n\n${detail}`,
    );
  }
  return {
    pushed: true,
    message: `Publikováno do větve ${status.branch || "main"}. Cloudflare teď může spustit nový build.`,
  };
}

async function serveFile(requestPath, response) {
  const requested = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const safe = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(EDITOR_ROOT, safe);
  if (!filePath.startsWith(EDITOR_ROOT)) return json(response, 404, { error: "Nenalezeno." });
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    const bytes = await readFile(filePath);
    response.writeHead(200, {
      "content-type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(bytes);
  } catch {
    json(response, 404, { error: "Nenalezeno." });
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${HOST}:${PORT}`);
  try {
    if (request.method === "GET" && url.pathname === "/api/content") {
      const content = JSON.parse(await readFile(CONTENT_PATH, "utf8"));
      return json(response, 200, content);
    }
    if (request.method === "GET" && url.pathname === "/api/status") {
      return json(response, 200, await gitStatus());
    }
    if (request.method === "POST" && url.pathname === "/api/image") {
      const src = await uploadImage(await body(request));
      return json(response, 200, { src });
    }
    if (request.method === "POST" && url.pathname === "/api/save") {
      const payload = await body(request);
      await saveContent(payload.data);
      return json(response, 200, { saved: true });
    }
    if (request.method === "POST" && url.pathname === "/api/publish") {
      const payload = await body(request);
      return json(response, 200, await publish(payload.data));
    }
    if (request.method !== "GET") return json(response, 405, { error: "Nepodporovaná operace." });
    return serveFile(url.pathname, response);
  } catch (error) {
    json(response, 500, { error: error.message || "Neznámá chyba editoru." });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Husí kůže · vizuální editor: http://${HOST}:${PORT}`);
  console.log("Okno terminálu nech otevřené. Ctrl+C editor ukončí.");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} už používá jiný program. Zavři staré okno editoru a spusť jej znovu.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
