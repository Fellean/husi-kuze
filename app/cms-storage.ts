import {
  emptyCmsContent,
  isCmsContent,
  type CmsContent,
} from "./cms-content";
import type { Locale } from "./i18n";

async function storage() {
  try {
    const { env } = await import("cloudflare:workers");
    const namespace = (env as typeof env & {
      CMS?: DurableObjectNamespace;
    }).CMS;
    return namespace?.getByName("site") ?? null;
  } catch {
    return null;
  }
}

export async function getCmsContent(locale: Locale): Promise<CmsContent> {
  try {
    const stub = await storage();
    if (!stub) return emptyCmsContent();
    const response = await stub.fetch(
      `https://cms.internal/content?locale=${encodeURIComponent(locale)}`,
    );
    if (!response.ok) return emptyCmsContent();
    const payload = (await response.json()) as { content?: unknown };
    return isCmsContent(payload.content)
      ? payload.content
      : emptyCmsContent();
  } catch {
    return emptyCmsContent();
  }
}
