import { env } from "cloudflare:workers";
import {
  createSessionToken,
  requestIsSameOrigin,
  safeReturnPath,
  sessionCookie,
  verifyAdminPassword,
} from "../../../selfhost-auth";

const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 10;

function storage() {
  const namespace = (env as typeof env & {
    CMS?: DurableObjectNamespace;
  }).CMS;
  if (!namespace) throw new Error("CMS storage binding is unavailable.");
  return namespace.getByName("site");
}

function loginUrl(ip: string, now?: number) {
  const url = new URL("https://cms.internal/login");
  url.searchParams.set("ip", ip);
  if (now !== undefined) {
    url.searchParams.set("now", String(now));
    url.searchParams.set("windowSeconds", String(WINDOW_SECONDS));
  }
  return url.toString();
}

async function currentAttemptCount(ip: string, now: number) {
  const response = await storage().fetch(loginUrl(ip, now));
  const payload = (await response.json()) as { attempts?: number };
  return Number(payload.attempts ?? 0);
}

async function recordFailure(ip: string, now: number) {
  await storage().fetch(loginUrl(ip), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ now, windowSeconds: WINDOW_SECONDS }),
  });
}

async function clearFailures(ip: string) {
  await storage().fetch(loginUrl(ip), { method: "DELETE" });
}

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) {
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = Math.floor(Date.now() / 1000);

  try {
    if ((await currentAttemptCount(ip, now)) >= MAX_ATTEMPTS) {
      return Response.json({ error: "Too many attempts." }, { status: 429 });
    }
  } catch {
    return Response.json(
      { error: "Editor storage is unavailable." },
      { status: 503 },
    );
  }

  let payload: { password?: unknown; returnTo?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const password =
    typeof payload.password === "string" ? payload.password : "";
  if (!(await verifyAdminPassword(password))) {
    await recordFailure(ip, now);
    return Response.json({ error: "Invalid password." }, { status: 401 });
  }

  await clearFailures(ip);
  const token = await createSessionToken();
  const redirectTo = safeReturnPath(
    typeof payload.returnTo === "string" ? payload.returnTo : "/?edit=1",
  );

  return Response.json(
    { redirectTo },
    { headers: { "set-cookie": sessionCookie(token) } },
  );
}
