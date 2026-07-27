import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "husi_kuze_editor";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type RuntimeEnv = {
  ADMIN_PASSWORD?: string;
};

type SessionPayload = {
  exp: number;
  role: "editor";
};

function runtimeEnv(): RuntimeEnv {
  return env as typeof env & RuntimeEnv;
}

function textBytes(value: string) {
  return new TextEncoder().encode(value);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sha256(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", textBytes(value)),
  );
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

async function sessionKey() {
  const password = runtimeEnv().ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("ADMIN_PASSWORD is missing or too short.");
  }
  return crypto.subtle.importKey(
    "raw",
    textBytes(`husi-kuze-editor-session-v1\u0000${password}`),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

async function sign(value: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await sessionKey(),
    textBytes(value),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifyToken(token: string | undefined) {
  if (!token) return false;
  const [payloadPart, signaturePart, extra] = token.split(".");
  if (!payloadPart || !signaturePart || extra) return false;

  try {
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      await sessionKey(),
      base64UrlToBytes(signaturePart),
      textBytes(payloadPart),
    );
    if (!validSignature) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payloadPart)),
    ) as Partial<SessionPayload>;
    return (
      payload.role === "editor" &&
      typeof payload.exp === "number" &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(value: string) {
  const expected = runtimeEnv().ADMIN_PASSWORD;
  if (!expected || expected.length < 12 || value.length > 256) return false;
  const [providedHash, expectedHash] = await Promise.all([
    sha256(value),
    sha256(expected),
  ]);
  return timingSafeEqual(providedHash, expectedHash);
}

export async function createSessionToken() {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    role: "editor",
  };
  const payloadPart = bytesToBase64Url(
    textBytes(JSON.stringify(payload)),
  );
  return `${payloadPart}.${await sign(payloadPart)}`;
}

export function sessionCookie(token: string) {
  return [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    `Max-Age=${SESSION_DURATION_SECONDS}`,
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
  ].join("; ");
}

export function expiredSessionCookie() {
  return [
    `${COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
  ].join("; ");
}

function cookieFromRequest(request: Request) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE_NAME) return value.join("=");
  }
  return undefined;
}

export async function isAdminRequest(request: Request) {
  if (process.env.NODE_ENV === "development") return true;
  return verifyToken(cookieFromRequest(request));
}

export async function hasAdminSession() {
  if (process.env.NODE_ENV === "development") return true;
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function requireAdminSession(returnTo: string) {
  if (await hasAdminSession()) return;
  redirect(editorLoginPath(returnTo));
}

export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://site.local");
    if (url.origin !== "https://site.local") return "/";
    if (url.pathname.startsWith("/api/")) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function editorLoginPath(returnTo: string) {
  return `/editor?returnTo=${encodeURIComponent(safeReturnPath(returnTo))}`;
}

export function requestIsSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
