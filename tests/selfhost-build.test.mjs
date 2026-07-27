import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("build provisions private storage without account-specific IDs", async () => {
  const config = JSON.parse(
    await readFile(new URL("dist/server/wrangler.json", root), "utf8"),
  );

  assert.deepEqual(config.compatibility_flags, ["nodejs_compat"]);
  assert.equal(config.main, "index.js");
  assert.equal(config.durable_objects?.bindings?.[0]?.name, "CMS");
  assert.equal(
    config.durable_objects?.bindings?.[0]?.class_name,
    "HusiKuzeCms",
  );
  assert.deepEqual(config.exports, {
    HusiKuzeCms: {
      type: "durable-object",
      storage: "sqlite",
    },
  });
  assert.deepEqual(config.migrations ?? [], []);
  assert.deepEqual(config.d1_databases ?? [], []);
  assert.deepEqual(config.r2_buckets ?? [], []);
});

test("server build contains self-hosted editor, auth and storage", async () => {
  const worker = await readFile(
    new URL("dist/server/index.js", root),
    "utf8",
  );

  assert.match(worker, /husi_kuze_editor/);
  assert.match(worker, /ADMIN_PASSWORD/);
  assert.match(worker, /HusiKuzeCms/);
  assert.match(worker, /cms_patches/);
  assert.match(worker, /cms_media/);
  assert.match(worker, /OPENAI_API_KEY/);
  assert.match(worker, /api\.openai\.com\/v1\/responses/);
  assert.match(worker, /gpt-5\.6-luna/);
  assert.match(worker, /husi_kuze_translation_batch/);
  assert.doesNotMatch(worker, /signin-with-chatgpt/);
  assert.doesNotMatch(worker, /oai-authenticated-user/);
  assert.doesNotMatch(worker, /chatgpt\.site/);
});

test("automatic translation stays authenticated and server-side", async () => {
  const route = await readFile(
    new URL("app/api/translate/route.ts", root),
    "utf8",
  );
  const editor = await readFile(
    new URL("app/components/InlineCms.tsx", root),
    "utf8",
  );

  assert.match(route, /isAdminRequest/);
  assert.match(route, /store:\s*false/);
  assert.match(route, /json_schema/);
  assert.match(route, /translatableKinds/);
  assert.match(editor, /Uložit \+ přeložit/);
  assert.match(editor, /translateAndPersist/);
  assert.match(editor, /translationError/);
});

test("route handlers clone internal responses before returning them", async () => {
  const cmsRoute = await readFile(
    new URL("app/api/cms/route.ts", root),
    "utf8",
  );
  const mediaRoute = await readFile(
    new URL("app/api/media/route.ts", root),
    "utf8",
  );

  for (const route of [cmsRoute, mediaRoute]) {
    assert.match(route, /new Response\(response\.body,/);
    assert.match(route, /headers: new Headers\(response\.headers\)/);
  }
  assert.doesNotMatch(cmsRoute, /return await storage\(\)\.fetch/);
  assert.doesNotMatch(mediaRoute, /return storage\(\)\.fetch/);
});

test("all three PDFs are packaged with the public website", async () => {
  const files = [
    "dist/client/downloads/husi-kuze-koncepce-cs.pdf",
    "dist/client/downloads/goosebumps-project-concept-en.pdf",
    "dist/client/downloads/husyacha-shkira-kontseptsiya-uk.pdf",
  ];

  for (const file of files) {
    const bytes = await readFile(new URL(file, root));
    assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
    assert.ok(bytes.length > 100_000);
  }
});

test("repository is ready for GitHub to Cloudflare deployment", async () => {
  const configSource = await readFile(
    new URL("wrangler.jsonc", root),
    "utf8",
  );
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );

  assert.equal(packageJson.scripts.build, "vinext build");
  assert.equal(packageJson.scripts.deploy, "npm run build && wrangler deploy");
  assert.doesNotMatch(configSource, /database_id/);
  assert.doesNotMatch(configSource, /bucket_name/);
});

test("large still images are compressed before Cloudflare storage", async () => {
  const editor = await readFile(
    new URL("app/components/InlineCms.tsx", root),
    "utf8",
  );

  assert.match(editor, /createImageBitmap/);
  assert.match(editor, /image\/webp/);
  assert.match(editor, /maxUploadBytes/);
});
