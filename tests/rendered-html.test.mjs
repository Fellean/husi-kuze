import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function renderHomepage() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders development preview metadata", async () => {
  const response = await renderHomepage();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("links the universal Google form without a nested scroll or music", async () => {
  const response = await renderHomepage();
  const html = await response.text();

  assert.match(
    html,
    /docs\.google\.com\/forms\/d\/1KLSA6G1r56sNfttj9TEaikH4jMwby3udJKYCDBL6XeM\/viewform/,
  );
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.doesNotMatch(html, /<audio\b/i);
  assert.doesNotMatch(html, /\.(?:wav|mp3|ogg)(?:["'?])/i);
  assert.doesNotMatch(html, /\/audio\//i);
});

test("presents the clean QR and optional contact route", async () => {
  const response = await renderHomepage();
  const html = await response.text();
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(html, /\/podpora\/qr-platba-clean\.png/);
  assert.match(html, /Instagram/);
  assert.match(html, /nepovinn/i);
  assert.match(css, /--media-radius:\s*18px/);
  assert.match(css, /\.modernHome img,[\s\S]*border-radius:\s*var\(--media-radius\)/);
});

test("uses the revised Czech edition as the default concept", async () => {
  const response = await renderHomepage();
  const html = await response.text();

  assert.match(html, /\/downloads\/husi-kuze-koncepce-cs\.pdf/);
  assert.doesNotMatch(html, /\/FOOTAGE_HUSI_KUZE_v4\.5\.pdf/);
});
