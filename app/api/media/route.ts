import { env } from "cloudflare:workers";
import { isAdminRequest } from "../../selfhost-auth";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const maxMediaBytes = 1_750_000;

function storage() {
  const namespace = (env as typeof env & {
    CMS?: DurableObjectNamespace;
  }).CMS;
  if (!namespace) throw new Error("CMS storage binding is unavailable.");
  return namespace.getByName("site");
}

function extension(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/gif") return "gif";
  return "webp";
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (!key || !key.startsWith("cms/")) {
    return new Response("Not found.", { status: 404 });
  }
  return storage().fetch(
    `https://cms.internal/media?key=${encodeURIComponent(key)}`,
  );
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const locale = String(form.get("locale") ?? "cs");
  const elementKey = String(form.get("key") ?? "image");

  if (!(file instanceof File)) {
    return Response.json({ error: "Image is required." }, { status: 400 });
  }
  if (!allowedTypes.has(file.type) || file.size > maxMediaBytes) {
    return Response.json(
      { error: "Use a JPG, PNG, WebP or GIF up to 1.75 MB." },
      { status: 400 },
    );
  }

  const safeLocale = ["cs", "en", "uk"].includes(locale) ? locale : "cs";
  const keyHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(elementKey),
  );
  const shortHash = Array.from(new Uint8Array(keyHash))
    .slice(0, 8)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const storageKey = `cms/${safeLocale}/${shortHash}/${crypto.randomUUID()}.${extension(file.type)}`;

  const response = await storage().fetch("https://cms.internal/media", {
    method: "POST",
    headers: {
      "content-type": file.type,
      "x-original-name": file.name,
      "x-storage-key": storageKey,
    },
    body: await file.arrayBuffer(),
  });
  if (!response.ok) return response;

  return Response.json({
    key: storageKey,
    url: `/api/media?key=${encodeURIComponent(storageKey)}`,
  });
}
