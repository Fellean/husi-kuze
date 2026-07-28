"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "../i18n";
import {
  emptyCmsContent,
  isCmsContent,
  type CmsContent,
} from "../cms-content";
import CmsContentManager, {
  type CmsBaseCategory,
} from "./CmsContentManager";

type PatchKind = "text" | "href" | "src" | "alt";

type CmsPatch = {
  key: string;
  kind: PatchKind;
  value: string;
};

type SelectedElement = {
  label: string;
  textKey?: string;
  linkKey?: string;
  href?: string;
  imageKey?: string;
  alt?: string;
};

type TranslationRetry = {
  patches: CmsPatch[];
  content?: CmsContent;
};

const contentPatchPrefix = "content::";

const labels = {
  cs: {
    title: "Upravuješ živý web",
    hint: "Klikni do textu a piš. Kliknutím vyber odkaz nebo obrázek.",
    save: "Uložit a zveřejnit",
    saveWithTranslation: "Uložit + přeložit",
    saving: "Ukládám…",
    saved: "Uloženo. Veřejná verze je aktuální.",
    translating: "GPT překládá do EN a UA…",
    translated: "Uloženo a přeloženo do EN i UA.",
    translationError: "Čeština je uložená, ale překlad selhal.",
    retryTranslation: "Zkusit překlad znovu",
    translateToggle: "Po uložení přeložit změny do EN + UA",
    reload: "Zahodit změny",
    selected: "Vybráno",
    link: "Adresa odkazu",
    image: "Nahradit obrázek",
    upload: "Vybrat nový obrázek",
    uploading: "Nahrávám…",
    clean: "Zatím žádné změny",
    dirty: "neuložených změn",
    error: "Uložení se nepovedlo. Zkus to znovu.",
    openArticle: "Otevřít článek v editoru",
    manage: "Přidat obsah",
    exit: "Konec úprav",
    logout: "Odhlásit editor",
  },
  en: {
    title: "You are editing the live website",
    hint: "Click text and type. Click a link or image to select it.",
    save: "Save and publish",
    saveWithTranslation: "Save + translate",
    saving: "Saving…",
    saved: "Saved. The public version is up to date.",
    translating: "GPT is translating into EN and UA…",
    translated: "Saved and translated into EN and UA.",
    translationError: "Czech was saved, but translation failed.",
    retryTranslation: "Retry translation",
    translateToggle: "Translate changes into EN + UA after saving",
    reload: "Discard changes",
    selected: "Selected",
    link: "Link address",
    image: "Replace image",
    upload: "Choose a new image",
    uploading: "Uploading…",
    clean: "No changes yet",
    dirty: "unsaved changes",
    error: "Saving failed. Please try again.",
    openArticle: "Open article in editor",
    manage: "Add content",
    exit: "Exit editing",
    logout: "Sign out",
  },
  uk: {
    title: "Ти редагуєш живий сайт",
    hint: "Натисни на текст і пиши. Натисни на посилання або зображення, щоб вибрати його.",
    save: "Зберегти й опублікувати",
    saveWithTranslation: "Зберегти + перекласти",
    saving: "Зберігаю…",
    saved: "Збережено. Публічна версія оновлена.",
    translating: "GPT перекладає англійською та українською…",
    translated: "Збережено й перекладено англійською та українською.",
    translationError: "Чеську версію збережено, але переклад не вдався.",
    retryTranslation: "Повторити переклад",
    translateToggle: "Після збереження перекласти зміни англійською та українською",
    reload: "Відкинути зміни",
    selected: "Вибрано",
    link: "Адреса посилання",
    image: "Замінити зображення",
    upload: "Вибрати нове зображення",
    uploading: "Завантажую…",
    clean: "Змін поки немає",
    dirty: "незбережених змін",
    error: "Не вдалося зберегти. Спробуй ще раз.",
    openArticle: "Відкрити статтю в редакторі",
    manage: "Додати вміст",
    exit: "Завершити редагування",
    logout: "Вийти",
  },
} as const;

function contentTranslationPatches(content: CmsContent): CmsPatch[] {
  const patches: CmsPatch[] = [];
  const add = (path: string, value: string, kind: PatchKind = "text") => {
    patches.push({
      key: `${contentPatchPrefix}${path}`,
      kind,
      value,
    });
  };

  content.categories.forEach((category, categoryIndex) => {
    add(`categories.${categoryIndex}.title`, category.title);
    add(`categories.${categoryIndex}.description`, category.description);
    category.images.forEach((image, imageIndex) => {
      add(
        `categories.${categoryIndex}.images.${imageIndex}.alt`,
        image.alt,
        "alt",
      );
      add(
        `categories.${categoryIndex}.images.${imageIndex}.title`,
        image.title,
      );
      add(
        `categories.${categoryIndex}.images.${imageIndex}.caption`,
        image.caption,
      );
    });
  });

  content.articles.forEach((article, articleIndex) => {
    for (const field of ["kicker", "title", "dek", "date", "thesis"] as const) {
      add(`articles.${articleIndex}.${field}`, article[field]);
    }
    add(`articles.${articleIndex}.coverAlt`, article.coverAlt, "alt");
    article.sections.forEach((section, sectionIndex) => {
      add(
        `articles.${articleIndex}.sections.${sectionIndex}.title`,
        section.title,
      );
      section.paragraphs.forEach((paragraph, paragraphIndex) => {
        add(
          `articles.${articleIndex}.sections.${sectionIndex}.paragraphs.${paragraphIndex}`,
          paragraph,
        );
      });
      if (section.imageAlt !== undefined) {
        add(
          `articles.${articleIndex}.sections.${sectionIndex}.imageAlt`,
          section.imageAlt,
          "alt",
        );
      }
    });
    article.sources.forEach((source, sourceIndex) => {
      add(
        `articles.${articleIndex}.sources.${sourceIndex}.title`,
        source.title,
      );
      add(
        `articles.${articleIndex}.sources.${sourceIndex}.note`,
        source.note,
      );
    });
  });

  content.buttons.forEach((button, buttonIndex) => {
    add(`buttons.${buttonIndex}.label`, button.label);
  });

  return patches;
}

function applyContentTranslations(
  content: CmsContent,
  patches: CmsPatch[],
): CmsContent {
  const translated = structuredClone(content);
  for (const patch of patches) {
    if (!patch.key.startsWith(contentPatchPrefix)) continue;
    const path = patch.key.slice(contentPatchPrefix.length).split(".");
    let current: unknown = translated;
    for (let index = 0; index < path.length - 1; index += 1) {
      if (!current || typeof current !== "object") break;
      current = (current as Record<string, unknown>)[path[index]];
    }
    if (current && typeof current === "object") {
      (current as Record<string, unknown>)[path.at(-1) ?? ""] = patch.value;
    }
  }
  return translated;
}

function elementPath(element: Element, root: Element): string {
  const segments: string[] = [];
  let current: Element | null = element;

  while (current && current !== root) {
    const parent: Element | null = current.parentElement;
    if (!parent) break;
    const siblings = Array.from(parent.children).filter(
      (sibling) => sibling.tagName === current?.tagName,
    );
    const position = siblings.indexOf(current) + 1;
    segments.push(`${current.tagName.toLowerCase()}:${position}`);
    current = parent;
  }

  return segments.reverse().join(">");
}

function patchId(key: string, kind: PatchKind): string {
  return `${kind}::${key}`;
}

function articleEditorHref(value: string, locale: Locale): string | null {
  if (!value.startsWith("/")) return null;

  try {
    const url = new URL(value, "https://site.local");
    if (!url.pathname.startsWith("/texty/")) return null;
    url.searchParams.set("edit", "1");
    if (locale === "cs") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", locale);
    }
    return `${url.pathname}?${url.searchParams.toString()}${url.hash}`;
  } catch {
    return null;
  }
}

function isEditableTextElement(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;
  if (element.closest("[data-cms-ignore]")) return false;
  if (element.children.length > 0) return false;
  return Boolean(element.textContent?.trim());
}

const maxUploadBytes = 1_700_000;

async function canvasBlob(
  bitmap: ImageBitmap,
  maxEdge: number,
  quality: number,
) {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image canvas is unavailable.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image conversion failed."))),
      "image/webp",
      quality,
    );
  });
}

async function prepareImage(file: File) {
  if (file.size <= maxUploadBytes) return file;
  if (file.type === "image/gif") {
    throw new Error("Animated GIF is too large.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const attempts = [
      [2400, 0.84],
      [2000, 0.78],
      [1700, 0.72],
      [1400, 0.68],
    ] as const;
    let lastBlob: Blob | undefined;
    for (const [maxEdge, quality] of attempts) {
      lastBlob = await canvasBlob(bitmap, maxEdge, quality);
      if (lastBlob.size <= maxUploadBytes) {
        const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
        return new File([lastBlob], `${baseName}.webp`, {
          type: "image/webp",
        });
      }
    }
    throw new Error(`Image remains too large (${lastBlob?.size ?? 0} bytes).`);
  } finally {
    bitmap.close();
  }
}

export default function InlineCms({
  locale,
  editable,
  scope,
  basePath = "/",
  baseCategories = [],
}: {
  locale: Locale;
  editable: boolean;
  scope: string;
  basePath?: string;
  baseCategories?: CmsBaseCategory[];
}) {
  const c = labels[locale];
  const router = useRouter();
  const dirty = useRef(new Map<string, CmsPatch>());
  const translationRetry = useRef<TranslationRetry | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const selectedImage = useRef<HTMLImageElement | null>(null);
  const selectedLink = useRef<HTMLAnchorElement | null>(null);
  const [dirtyCount, setDirtyCount] = useState(0);
  const [status, setStatus] = useState<
    | "idle"
    | "saving"
    | "saved"
    | "translating"
    | "translated"
    | "translationError"
    | "error"
  >("idle");
  const [autoTranslate, setAutoTranslate] = useState(locale === "cs");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [content, setContent] = useState<CmsContent>(emptyCmsContent);
  const [contentDirty, setContentDirty] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const totalDirty = dirtyCount + (contentDirty ? 1 : 0);
  const selectedArticleHref = selected?.href
    ? articleEditorHref(selected.href, locale)
    : null;

  function remember(patch: CmsPatch) {
    dirty.current.set(patchId(patch.key, patch.kind), patch);
    setDirtyCount(dirty.current.size);
    setStatus("idle");
  }

  useEffect(() => {
    const rootElement = document.querySelector("[data-cms-root]");
    if (!rootElement) return;
    const root = rootElement;

    let cancelled = false;
    let cleanupListeners = () => {};

    async function initialize() {
      const [response, contentResponse] = await Promise.all([
        fetch(`/api/cms?locale=${locale}`, { cache: "no-store" }),
        fetch(`/api/cms?locale=${locale}&content=1`, {
          cache: "no-store",
        }),
      ]);
      const payload = response.ok
        ? ((await response.json()) as { patches?: CmsPatch[] })
        : { patches: [] };
      const contentPayload = contentResponse.ok
        ? ((await contentResponse.json()) as { content?: unknown })
        : { content: undefined };
      if (cancelled) return;
      setContent(
        isCmsContent(contentPayload.content)
          ? contentPayload.content
          : emptyCmsContent(),
      );
      setContentDirty(false);

      const patches = new Map(
        (payload.patches ?? []).map((patch) => [
          patchId(patch.key, patch.kind),
          patch,
        ]),
      );

      const textSelector =
        "h1,h2,h3,h4,p,span,strong,small,b,em,blockquote,a,figcaption";
      const textElements = Array.from(root.querySelectorAll(textSelector)).filter(
        isEditableTextElement,
      );
      const links = Array.from(root.querySelectorAll("a[href]")).filter(
        (element) => !element.closest("[data-cms-ignore]"),
      ) as HTMLAnchorElement[];
      const images = Array.from(root.querySelectorAll("img")).filter(
        (element) => !element.closest("[data-cms-ignore]"),
      ) as HTMLImageElement[];

      for (const element of textElements) {
        const key = `${scope}::${elementPath(element, root)}`;
        element.dataset.cmsTextKey = key;
        const patch = patches.get(patchId(key, "text"));
        if (patch) element.textContent = patch.value;
        if (editable) {
          element.contentEditable = "plaintext-only";
          element.spellcheck = true;
          element.classList.add("cmsEditableText");
        }
      }

      for (const link of links) {
        const key = `${scope}::${elementPath(link, root)}`;
        link.dataset.cmsLinkKey = key;
        const patch = patches.get(patchId(key, "href"));
        if (patch) link.href = patch.value;
        if (editable) link.classList.add("cmsEditableLink");
      }

      for (const image of images) {
        const key = `${scope}::${elementPath(image, root)}`;
        image.dataset.cmsImageKey = key;
        const srcPatch = patches.get(patchId(key, "src"));
        const altPatch = patches.get(patchId(key, "alt"));
        if (srcPatch) image.src = srcPatch.value;
        if (altPatch) image.alt = altPatch.value;
        if (editable) image.classList.add("cmsEditableImage");
      }

      if (!editable) return;

      const onInput = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const key = target.dataset.cmsTextKey;
        if (!key) return;
        remember({ key, kind: "text", value: target.textContent ?? "" });
      };

      const onClick = (event: Event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const image = target.closest("img[data-cms-image-key]");
        if (image instanceof HTMLImageElement) {
          event.preventDefault();
          event.stopPropagation();
          document
            .querySelectorAll(".cmsSelected")
            .forEach((element) => element.classList.remove("cmsSelected"));
          image.classList.add("cmsSelected");
          selectedImage.current = image;
          selectedLink.current = null;
          setSelected({
            label: image.alt || image.currentSrc.split("/").pop() || "obrázek",
            imageKey: image.dataset.cmsImageKey,
            alt: image.alt,
          });
          return;
        }

        const link = target.closest("a[data-cms-link-key]");
        if (link instanceof HTMLAnchorElement) {
          event.preventDefault();
          document
            .querySelectorAll(".cmsSelected")
            .forEach((element) => element.classList.remove("cmsSelected"));
          link.classList.add("cmsSelected");
          selectedLink.current = link;
          selectedImage.current = null;
          setSelected({
            label: link.textContent?.trim() || link.href,
            linkKey: link.dataset.cmsLinkKey,
            href: link.getAttribute("href") ?? "",
          });
        }
      };

      const onFocus = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const textKey = target.dataset.cmsTextKey;
        if (!textKey) return;
        const link = target.closest("a[data-cms-link-key]");
        selectedLink.current =
          link instanceof HTMLAnchorElement ? link : null;
        selectedImage.current = null;
        setSelected({
          label: target.textContent?.trim().slice(0, 80) || target.tagName,
          textKey,
          linkKey:
            link instanceof HTMLAnchorElement
              ? link.dataset.cmsLinkKey
              : undefined,
          href:
            link instanceof HTMLAnchorElement
              ? link.getAttribute("href") ?? ""
              : undefined,
        });
      };

      root.addEventListener("input", onInput);
      root.addEventListener("click", onClick, true);
      root.addEventListener("focusin", onFocus);
      cleanupListeners = () => {
        root.removeEventListener("input", onInput);
        root.removeEventListener("click", onClick, true);
        root.removeEventListener("focusin", onFocus);
      };
    }

    void initialize();
    return () => {
      cancelled = true;
      cleanupListeners();
    };
  }, [editable, locale, scope]);

  useEffect(() => {
    if (!editable) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty.current.size === 0 && !contentDirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [contentDirty, editable]);

  async function persistLocale(targetLocale: Locale, patches: CmsPatch[]) {
    const response = await fetch("/api/cms", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        locale: targetLocale,
        patches,
      }),
    });
    if (response.ok) return true;

    let reason = "";
    try {
      const payload = (await response.json()) as { error?: unknown };
      if (typeof payload.error === "string") reason = payload.error;
    } catch {
      reason = `HTTP ${response.status}`;
    }
    console.error("CMS save failed.", response.status, reason);
    return false;
  }

  async function persistContent(
    targetLocale: Locale,
    targetContent: CmsContent,
  ) {
    const response = await fetch("/api/cms", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        locale: targetLocale,
        content: targetContent,
      }),
    });
    if (response.ok) return true;

    let reason = "";
    try {
      const payload = (await response.json()) as { error?: unknown };
      if (typeof payload.error === "string") reason = payload.error;
    } catch {
      reason = `HTTP ${response.status}`;
    }
    console.error("CMS content save failed.", response.status, reason);
    return false;
  }

  async function translateAndPersist(
    patches: CmsPatch[],
    targetContent?: CmsContent,
  ) {
    const contentPatches = targetContent
      ? contentTranslationPatches(targetContent)
      : [];
    const translationBatch = [...patches, ...contentPatches];
    if (translationBatch.length === 0) return true;

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ patches: translationBatch }),
    });
    if (!response.ok) return false;

    const payload = (await response.json()) as {
      translations?: { en?: CmsPatch[]; uk?: CmsPatch[] };
    };
    const en = payload.translations?.en;
    const uk = payload.translations?.uk;
    if (!Array.isArray(en) || !Array.isArray(uk)) return false;

    const enPatches = en.filter(
      (patch) => !patch.key.startsWith(contentPatchPrefix),
    );
    const ukPatches = uk.filter(
      (patch) => !patch.key.startsWith(contentPatchPrefix),
    );
    const requests: Promise<boolean>[] = [];
    if (enPatches.length > 0) requests.push(persistLocale("en", enPatches));
    if (ukPatches.length > 0) requests.push(persistLocale("uk", ukPatches));
    if (targetContent) {
      requests.push(
        persistContent(
          "en",
          applyContentTranslations(targetContent, en),
        ),
        persistContent(
          "uk",
          applyContentTranslations(targetContent, uk),
        ),
      );
    }
    const results = await Promise.all(requests);
    return results.every(Boolean);
  }

  async function retryTranslation() {
    const retry = translationRetry.current;
    if (!retry) return;
    setStatus("translating");
    if (await translateAndPersist(retry.patches, retry.content)) {
      translationRetry.current = null;
      setStatus("translated");
    } else {
      setStatus("translationError");
    }
  }

  async function save() {
    if (dirty.current.size === 0 && !contentDirty) return;
    setStatus("saving");
    const patches = Array.from(dirty.current.values());
    const contentToSave = contentDirty ? structuredClone(content) : undefined;
    const localResults = await Promise.all([
      patches.length > 0 ? persistLocale(locale, patches) : Promise.resolve(true),
      contentToSave
        ? persistContent(locale, contentToSave)
        : Promise.resolve(true),
    ]);
    if (!localResults.every(Boolean)) {
      setStatus("error");
      return;
    }

    dirty.current.clear();
    setDirtyCount(0);
    setContentDirty(false);
    if (locale !== "cs" || !autoTranslate) {
      translationRetry.current = null;
      setStatus("saved");
      router.refresh();
      return;
    }

    translationRetry.current = {
      patches,
      content: contentToSave,
    };
    setStatus("translating");
    if (await translateAndPersist(patches, contentToSave)) {
      translationRetry.current = null;
      setStatus("translated");
      router.refresh();
    } else {
      setStatus("translationError");
      router.refresh();
    }
  }

  function updateHref(value: string) {
    const link = selectedLink.current;
    const key = selected?.linkKey;
    if (!link || !key) return;
    link.setAttribute("href", value);
    setSelected((current) => (current ? { ...current, href: value } : current));
    remember({ key, kind: "href", value });
  }

  function updateAlt(value: string) {
    const image = selectedImage.current;
    const key = selected?.imageKey;
    if (!image || !key) return;
    image.alt = value;
    setSelected((current) => (current ? { ...current, alt: value } : current));
    remember({ key, kind: "alt", value });
  }

  async function uploadMedia(file: File, key: string) {
    const prepared = await prepareImage(file);
    const body = new FormData();
    body.set("file", prepared);
    body.set("locale", locale);
    body.set("key", key);

    const response = await fetch("/api/media", { method: "POST", body });
    const payload = (await response.json()) as { url?: string };
    if (!response.ok || !payload.url) {
      throw new Error("Image upload failed.");
    }
    return payload.url;
  }

  async function uploadImage(file: File) {
    const image = selectedImage.current;
    const key = selected?.imageKey;
    if (!image || !key) return;
    setUploading(true);

    try {
      const url = await uploadMedia(file, key);
      image.src = url;
      remember({ key, kind: "src", value: url });
    } catch {
      setStatus("error");
    } finally {
      setUploading(false);
    }
  }

  if (!editable) return null;

  return (
    <>
      <aside className="cmsToolbar" data-cms-ignore aria-label={c.title}>
        <div className="cmsToolbarIntro">
          <strong>{c.title}</strong>
          <span>{c.hint}</span>
          {locale === "cs" && (
            <label className="cmsAutoTranslate">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(event) => setAutoTranslate(event.target.checked)}
              />
              {c.translateToggle}
            </label>
          )}
        </div>

        <nav className="cmsLanguages" aria-label="Jazyk upravované stránky">
          <Link
            aria-current={locale === "cs" ? "page" : undefined}
            href={`${basePath}?edit=1`}
          >
            CS
          </Link>
          <Link
            aria-current={locale === "en" ? "page" : undefined}
            href={`${basePath}?edit=1&lang=en`}
          >
            EN
          </Link>
          <Link
            aria-current={locale === "uk" ? "page" : undefined}
            href={`${basePath}?edit=1&lang=uk`}
          >
            UA
          </Link>
        </nav>

        <button
          type="button"
          className="cmsManage"
          onClick={() => setManagerOpen(true)}
        >
          + {c.manage}
        </button>

        {selected && (
          <div className="cmsSelection">
            <span>
              {c.selected}: <strong>{selected.label}</strong>
            </span>
            {selected.linkKey && (
              <>
                <label>
                  {c.link}
                  <input
                    type="url"
                    value={selected.href ?? ""}
                    onChange={(event) => updateHref(event.target.value)}
                  />
                </label>
                {selectedArticleHref && (
                  <Link className="cmsOpen" href={selectedArticleHref}>
                    {c.openArticle}
                  </Link>
                )}
              </>
            )}
            {selected.imageKey && (
              <>
                <label>
                  Alt
                  <input
                    type="text"
                    value={selected.alt ?? ""}
                    onChange={(event) => updateAlt(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? c.uploading : c.upload}
                </button>
                <input
                  ref={fileInput}
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadImage(file);
                    event.target.value = "";
                  }}
                />
              </>
            )}
          </div>
        )}

        <div className="cmsActions">
          <span>
            {totalDirty === 0 ? c.clean : `${totalDirty} ${c.dirty}`}
          </span>
          {status === "saved" && <b>{c.saved}</b>}
          {status === "translating" && <b>{c.translating}</b>}
          {status === "translated" && <b>{c.translated}</b>}
          {status === "translationError" && (
            <>
              <b className="cmsError">{c.translationError}</b>
              <button
                type="button"
                onClick={() => void retryTranslation()}
              >
                {c.retryTranslation}
              </button>
            </>
          )}
          {status === "error" && <b className="cmsError">{c.error}</b>}
          <button
            type="button"
            className="cmsDiscard"
            onClick={() => window.location.reload()}
            disabled={totalDirty === 0}
          >
            {c.reload}
          </button>
          <button
            type="button"
            className="cmsSave"
            onClick={() => void save()}
            disabled={
              totalDirty === 0 ||
              status === "saving" ||
              status === "translating"
            }
          >
            {status === "saving"
              ? c.saving
              : status === "translating"
                ? c.translating
                : locale === "cs" && autoTranslate
                  ? c.saveWithTranslation
                  : c.save}
          </button>
          <Link
            className="cmsExit"
            href={locale === "cs" ? basePath : `${basePath}?lang=${locale}`}
          >
            {c.exit}
          </Link>
          <a
            className="cmsExit"
            href={`/api/auth/logout?returnTo=${encodeURIComponent(
              locale === "cs" ? basePath : `${basePath}?lang=${locale}`,
            )}`}
          >
            {c.logout}
          </a>
        </div>
      </aside>

      {managerOpen && (
        <CmsContentManager
          locale={locale}
          content={content}
          baseCategories={baseCategories}
          onSave={(nextContent) => {
            setContent(nextContent);
            setContentDirty(true);
            setStatus("idle");
          }}
          onClose={() => setManagerOpen(false)}
          upload={uploadMedia}
        />
      )}
    </>
  );
}
