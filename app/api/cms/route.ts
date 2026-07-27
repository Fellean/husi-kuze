import { env } from "cloudflare:workers";
import { isAdminRequest } from "../../selfhost-auth";

type PatchKind = "text" | "href" | "src" | "alt";

type CmsPatch = {
  key: string;
  kind: PatchKind;
  value: string;
};

const allowedLocales = new Set(["cs", "en", "uk"]);
const allowedKinds = new Set<PatchKind>(["text", "href", "src", "alt"]);

function storage() {
  const namespace = (env as typeof env & {
    CMS?: DurableObjectNamespace;
  }).CMS;
  if (!namespace) throw new Error("CMS storage binding is unavailable.");
  return namespace.getByName("site");
}

function mutableResponse(response: Response) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
}

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

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") ?? "cs";
  if (!allowedLocales.has(locale)) {
    return Response.json({ error: "Unsupported locale." }, { status: 400 });
  }

  try {
    const response = await storage().fetch(
      `https://cms.internal/patches?locale=${encodeURIComponent(locale)}`,
    );
    return mutableResponse(response);
  } catch {
    return Response.json(
      { patches: [] },
      { headers: { "cache-control": "no-store" } },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: { locale?: string; patches?: unknown[] };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const locale = payload.locale ?? "";
  const patches = payload.patches ?? [];
  if (!allowedLocales.has(locale)) {
    return Response.json({ error: "Unsupported locale." }, { status: 400 });
  }
  if (
    !Array.isArray(patches) ||
    patches.length > 1_000 ||
    !patches.every(validPatch)
  ) {
    return Response.json({ error: "Invalid patch list." }, { status: 400 });
  }

  const response = await storage().fetch("https://cms.internal/patches", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ locale, patches }),
  });
  return mutableResponse(response);
}
