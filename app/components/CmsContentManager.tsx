"use client";

import { useState } from "react";
import type {
  CmsArticle,
  CmsArticleSource,
  CmsContent,
} from "../cms-content";
import type { Locale } from "../i18n";

type Tab = "categories" | "articles" | "buttons";
export type CmsBaseCategory = {
  id: string;
  title: string;
};

const copy = {
  cs: {
    title: "Správa obsahu",
    lead: "Tady přidáváš nové části webu. Všechno se zveřejní až hlavním tlačítkem Uložit.",
    categories: "Kategorie",
    articles: "Články",
    buttons: "Tlačítka",
    addCategory: "Přidat kategorii",
    addArticle: "Přidat článek",
    addButton: "Přidat tlačítko",
    addImages: "Přidat fotky",
    replaceImage: "Vyměnit obrázek",
    save: "Uložit změny",
    cancel: "Zrušit",
    moveUp: "Posunout nahoru",
    moveDown: "Posunout dolů",
    builtIn: "Původní kategorie",
    builtInNote: "Obsah upravíš kliknutím přímo na webu. Tady měníš její pořadí.",
    unsaved: "Zahodit neuložené změny?",
    delete: "Smazat",
    close: "Zavřít",
    emptyCategories: "Zatím tu není žádná nová kategorie.",
    emptyArticles: "Zatím tu není žádný nový článek.",
    emptyButtons: "Zatím tu není žádné nové tlačítko.",
    uploadError: "Obrázek se nepodařilo nahrát.",
  },
  en: {
    title: "Content manager",
    lead: "Add new website sections here. They are published only after using the main Save button.",
    categories: "Categories",
    articles: "Articles",
    buttons: "Buttons",
    addCategory: "Add category",
    addArticle: "Add article",
    addButton: "Add button",
    addImages: "Add images",
    replaceImage: "Replace image",
    save: "Save changes",
    cancel: "Cancel",
    moveUp: "Move up",
    moveDown: "Move down",
    builtIn: "Original category",
    builtInNote: "Edit its content directly on the website. Change its order here.",
    unsaved: "Discard unsaved changes?",
    delete: "Delete",
    close: "Close",
    emptyCategories: "No new category yet.",
    emptyArticles: "No new article yet.",
    emptyButtons: "No new button yet.",
    uploadError: "The image could not be uploaded.",
  },
  uk: {
    title: "Керування вмістом",
    lead: "Тут можна додавати нові частини сайту. Вони публікуються лише після натискання головної кнопки збереження.",
    categories: "Категорії",
    articles: "Статті",
    buttons: "Кнопки",
    addCategory: "Додати категорію",
    addArticle: "Додати статтю",
    addButton: "Додати кнопку",
    addImages: "Додати зображення",
    replaceImage: "Замінити зображення",
    save: "Зберегти зміни",
    cancel: "Скасувати",
    moveUp: "Перемістити вгору",
    moveDown: "Перемістити вниз",
    builtIn: "Оригінальна категорія",
    builtInNote: "Редагуй вміст безпосередньо на сайті. Тут можна змінити порядок.",
    unsaved: "Відкинути незбережені зміни?",
    delete: "Видалити",
    close: "Закрити",
    emptyCategories: "Нових категорій поки немає.",
    emptyArticles: "Нових статей поки немає.",
    emptyButtons: "Нових кнопок поки немає.",
    uploadError: "Не вдалося завантажити зображення.",
  },
} as const;

function id() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `cms-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function articleBody(article: CmsArticle) {
  return article.sections
    .map(
      (section) =>
        `## ${section.title}\n\n${section.paragraphs.join("\n\n")}`,
    )
    .join("\n\n");
}

function parseArticleBody(
  value: string,
  previousSections: CmsArticle["sections"],
) {
  const sections = value
    .split(/\n(?=##\s+)/g)
    .map((chunk, index) => {
      const lines = chunk.trim().split("\n");
      const title = (lines.shift() ?? "")
        .replace(/^##\s+/, "")
        .trim() || "Bez názvu";
      const paragraphs = lines
        .join("\n")
        .split(/\n\s*\n/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
      return {
        id: previousSections[index]?.id ?? id(),
        title,
        paragraphs: paragraphs.length ? paragraphs : [""],
      };
    })
    .filter((section) => section.title || section.paragraphs.some(Boolean));

  return sections.length
    ? sections
    : [
        {
          id: previousSections[0]?.id ?? id(),
          title: "Text",
          paragraphs: [""],
        },
      ];
}

function sourcesBody(article: CmsArticle) {
  return article.sources
    .map((source) =>
      [source.n, source.title, source.author, source.url, source.note].join(
        " | ",
      ),
    )
    .join("\n");
}

function parseSources(
  value: string,
  previousSources: CmsArticleSource[],
): CmsArticleSource[] {
  return value
    .split("\n")
    .map((line, index) => {
      const [n, title, author, url, ...note] = line
        .split("|")
        .map((part) => part.trim());
      return {
        id: previousSources[index]?.id ?? id(),
        n: n || String(index + 1).padStart(2, "0"),
        title: title || "",
        author: author || "",
        url: url || "",
        note: note.join(" | "),
      };
    })
    .filter((source) => source.title || source.url || source.note);
}

export default function CmsContentManager({
  locale,
  content,
  baseCategories,
  onSave,
  onClose,
  upload,
}: {
  locale: Locale;
  content: CmsContent;
  baseCategories: CmsBaseCategory[];
  onSave: (content: CmsContent) => void;
  onClose: () => void;
  upload: (file: File, key: string) => Promise<string>;
}) {
  const c = copy[locale];
  const [tab, setTab] = useState<Tab>("categories");
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<CmsContent>(() =>
    structuredClone(content),
  );
  const [changed, setChanged] = useState(false);

  function change(mutator: (draft: CmsContent) => void) {
    setDraft((current) => {
      const next = structuredClone(current);
      mutator(next);
      return next;
    });
    setChanged(true);
  }

  function close() {
    if (changed && !confirm(c.unsaved)) return;
    onClose();
  }

  function saveAndClose() {
    onSave(draft);
    onClose();
  }

  function moveItem<T>(items: T[], from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const [item] = items.splice(from, 1);
    items.splice(to, 0, item);
  }

  function orderedCategoryIds(current: CmsContent) {
    const available = [
      ...baseCategories.map((category) => category.id),
      ...current.categories.map((category) => category.id),
    ];
    const saved = (current.categoryOrder ?? []).filter((categoryId) =>
      available.includes(categoryId),
    );
    return [...saved, ...available.filter((categoryId) => !saved.includes(categoryId))];
  }

  function moveCategory(categoryId: string, direction: -1 | 1) {
    change((current) => {
      const order = orderedCategoryIds(current);
      const index = order.indexOf(categoryId);
      moveItem(order, index, index + direction);
      current.categoryOrder = order;
    });
  }

  async function uploadFiles(
    files: File[],
    keyPrefix: string,
    onUploaded: (items: { src: string; file: File; id: string }[]) => void,
  ) {
    if (files.length === 0) return;
    setUploading(keyPrefix);
    setError("");
    try {
      const uploaded = [];
      for (const file of files) {
        const imageId = id();
        const src = await upload(file, `${keyPrefix}:${imageId}`);
        uploaded.push({ src, file, id: imageId });
      }
      onUploaded(uploaded);
    } catch {
      setError(c.uploadError);
    } finally {
      setUploading(null);
    }
  }

  function addCategory() {
    change((current) => {
      const count = current.categories.length + 1;
      const categoryId = id();
      current.categories.push({
        id: categoryId,
        title: `Nová kategorie ${count}`,
        description: "",
        images: [],
        layout: "strip",
        frame: "line",
        imageFit: "cover",
        imageRatio: "landscape",
        columns: 3,
        backgroundColor: "#f2eee7",
        textColor: "#111820",
        accentColor: "#ed2859",
      });
      current.categoryOrder = [...orderedCategoryIds(current), categoryId].filter(
        (value, index, all) => all.indexOf(value) === index,
      );
    });
  }

  function addArticle() {
    change((draft) => {
      const count = draft.articles.length + 1;
      const title = `Nový článek ${count}`;
      let slug = slugify(title);
      while (draft.articles.some((article) => article.slug === slug)) {
        slug = `${slug}-${count + 1}`;
      }
      draft.articles.push({
        id: id(),
        slug,
        kicker: "Autorský text",
        title,
        dek: "",
        date: new Intl.DateTimeFormat(locale === "cs" ? "cs-CZ" : locale, {
          month: "long",
          year: "numeric",
        }).format(new Date()),
        cover: "/gallery/jehelnice-lebka.webp",
        coverAlt: "",
        thesis: "",
        sections: [
          {
            id: id(),
            title: "První část",
            paragraphs: ["Začni psát tady."],
          },
        ],
        sources: [],
      });
    });
  }

  function addButton() {
    change((draft) => {
      draft.buttons.push({
        id: id(),
        label: "Nové tlačítko",
        href: "https://",
        location: "hero",
        style: "strong",
        target: "new",
        frame: "none",
        shape: "square",
        width: "auto",
        backgroundColor: "#ed2859",
        textColor: "#ffffff",
        borderColor: "#ed2859",
      });
    });
  }

  const baseById = new Map(
    baseCategories.map((category) => [category.id, category]),
  );
  const customById = new Map(
    draft.categories.map((category) => [category.id, category]),
  );
  const categoryOrder = orderedCategoryIds(draft);

  return (
    <div
      className="cmsManagerBackdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        className="cmsManager"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cms-manager-title"
      >
        <header className="cmsManagerHead">
          <div>
            <span>CMS · {locale.toUpperCase()}</span>
            <h2 id="cms-manager-title">{c.title}</h2>
            <p>{c.lead}</p>
          </div>
          <button type="button" onClick={close} aria-label={c.close}>
            ×
          </button>
        </header>

        <nav className="cmsManagerTabs" aria-label={c.title}>
          {(
            [
              ["categories", c.categories],
              ["articles", c.articles],
              ["buttons", c.buttons],
            ] as const
          ).map(([value, label]) => (
            <button
              type="button"
              className={tab === value ? "active" : ""}
              onClick={() => setTab(value)}
              key={value}
            >
              {label}
              <b>
                {value === "categories"
                  ? categoryOrder.length
                  : value === "articles"
                    ? draft.articles.length
                    : draft.buttons.length}
              </b>
            </button>
          ))}
        </nav>

        {error && <p className="cmsManagerError">{error}</p>}

        {tab === "categories" && (
          <div className="cmsManagerPanel">
            <button
              type="button"
              className="cmsManagerAdd"
              onClick={addCategory}
            >
              + {c.addCategory}
            </button>
            <div className="cmsOrderList" aria-label={c.categories}>
              {categoryOrder.map((categoryId, categoryIndex) => {
                const baseCategory = baseById.get(categoryId);
                const customCategory = customById.get(categoryId);
                return (
                  <div key={categoryId}>
                    <span>
                      <b>{String(categoryIndex + 1).padStart(2, "0")}</b>
                      <strong>
                        {baseCategory?.title ??
                          customCategory?.title ??
                          categoryId}
                      </strong>
                      <small>
                        {baseCategory ? c.builtIn : c.categories}
                      </small>
                    </span>
                    <div className="cmsMoveButtons">
                      <button
                        type="button"
                        onClick={() => moveCategory(categoryId, -1)}
                        disabled={categoryIndex === 0}
                        aria-label={c.moveUp}
                        title={c.moveUp}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCategory(categoryId, 1)}
                        disabled={categoryIndex === categoryOrder.length - 1}
                        aria-label={c.moveDown}
                        title={c.moveDown}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {draft.categories.length === 0 && (
              <p className="cmsManagerEmpty">{c.emptyCategories}</p>
            )}
            {draft.categories.map((category, categoryIndex) => (
              <article className="cmsManagerCard" key={category.id}>
                <header>
                  <strong>{String(categoryIndex + 1).padStart(2, "0")}</strong>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      if (
                        !confirm(
                          `Smazat kategorii „${category.title}“ i její fotky z webu?`,
                        )
                      ) {
                        return;
                      }
                      change((draft) => {
                        draft.categories.splice(categoryIndex, 1);
                        draft.categoryOrder = orderedCategoryIds(draft).filter(
                          (categoryId) => categoryId !== category.id,
                        );
                      });
                    }}
                  >
                    {c.delete}
                  </button>
                </header>
                <div className="cmsManagerFields">
                  <label>
                    Název
                    <input
                      value={category.title}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].title =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label className="wide">
                    Popis
                    <textarea
                      rows={3}
                      value={category.description}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].description =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Rozložení
                    <select
                      value={category.layout ?? "strip"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].layout = event.target
                            .value as typeof category.layout;
                        })
                      }
                    >
                      <option value="strip">Vodorovný pás</option>
                      <option value="grid">Mřížka</option>
                      <option value="feature">První obraz dominantní</option>
                    </select>
                  </label>
                  <label>
                    Rámování sekce
                    <select
                      value={category.frame ?? "line"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].frame = event.target
                            .value as typeof category.frame;
                        })
                      }
                    >
                      <option value="none">Bez rámu</option>
                      <option value="line">Tenká linka</option>
                      <option value="heavy">Silný rám</option>
                      <option value="shadow">Rám + stín</option>
                    </select>
                  </label>
                  <label>
                    Poměr obrázků
                    <select
                      value={category.imageRatio ?? "landscape"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].imageRatio = event
                            .target.value as typeof category.imageRatio;
                        })
                      }
                    >
                      <option value="landscape">Na šířku</option>
                      <option value="square">Čtverec</option>
                      <option value="portrait">Na výšku</option>
                    </select>
                  </label>
                  <label>
                    Ořez obrázků
                    <select
                      value={category.imageFit ?? "cover"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].imageFit = event.target
                            .value as typeof category.imageFit;
                        })
                      }
                    >
                      <option value="cover">Vyplnit rám a oříznout</option>
                      <option value="contain">Ukázat celý obrázek</option>
                    </select>
                  </label>
                  <label>
                    Sloupce v mřížce
                    <select
                      value={category.columns ?? 3}
                      disabled={(category.layout ?? "strip") !== "grid"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.categories[categoryIndex].columns = Number(
                            event.target.value,
                          ) as typeof category.columns;
                        })
                      }
                    >
                      <option value="2">2 sloupce</option>
                      <option value="3">3 sloupce</option>
                      <option value="4">4 sloupce</option>
                    </select>
                  </label>
                  <div className="cmsColorFields wide">
                    <label>
                      Barva pozadí
                      <input
                        type="color"
                        value={category.backgroundColor ?? "#f2eee7"}
                        onChange={(event) =>
                          change((draft) => {
                            draft.categories[categoryIndex].backgroundColor =
                              event.target.value;
                          })
                        }
                      />
                    </label>
                    <label>
                      Barva textu
                      <input
                        type="color"
                        value={category.textColor ?? "#111820"}
                        onChange={(event) =>
                          change((draft) => {
                            draft.categories[categoryIndex].textColor =
                              event.target.value;
                          })
                        }
                      />
                    </label>
                    <label>
                      Barva akcentu
                      <input
                        type="color"
                        value={category.accentColor ?? "#ed2859"}
                        onChange={(event) =>
                          change((draft) => {
                            draft.categories[categoryIndex].accentColor =
                              event.target.value;
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
                <label className="cmsManagerUpload">
                  {uploading === `category:${category.id}`
                    ? "Nahrávám…"
                    : `+ ${c.addImages}`}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    disabled={Boolean(uploading)}
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []);
                      event.target.value = "";
                      void uploadFiles(
                        files,
                        `category:${category.id}`,
                        (items) =>
                          change((draft) => {
                            draft.categories[categoryIndex].images.push(
                              ...items.map((item) => ({
                                id: item.id,
                                src: item.src,
                                alt: "",
                                title: item.file.name.replace(/\.[^.]+$/, ""),
                                caption: "",
                              })),
                            );
                          }),
                      );
                    }}
                  />
                </label>
                <div className="cmsManagerImages">
                  {category.images.map((image, imageIndex) => (
                    <section key={image.id}>
                      <img src={image.src} alt="" />
                      <div>
                        <label>
                          Název
                          <input
                            value={image.title}
                            onChange={(event) =>
                              change((draft) => {
                                draft.categories[categoryIndex].images[
                                  imageIndex
                                ].title = event.target.value;
                              })
                            }
                          />
                        </label>
                        <label>
                          Alt text
                          <input
                            value={image.alt}
                            onChange={(event) =>
                              change((draft) => {
                                draft.categories[categoryIndex].images[
                                  imageIndex
                                ].alt = event.target.value;
                              })
                            }
                          />
                        </label>
                        <label className="wide">
                          Popisek
                          <textarea
                            rows={2}
                            value={image.caption}
                            onChange={(event) =>
                              change((draft) => {
                                draft.categories[categoryIndex].images[
                                  imageIndex
                                ].caption = event.target.value;
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="cmsImageActions">
                        <div className="cmsMoveButtons">
                          <button
                            type="button"
                            onClick={() =>
                              change((draft) => {
                                moveItem(
                                  draft.categories[categoryIndex].images,
                                  imageIndex,
                                  imageIndex - 1,
                                );
                              })
                            }
                            disabled={imageIndex === 0}
                            aria-label={c.moveUp}
                            title={c.moveUp}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              change((draft) => {
                                moveItem(
                                  draft.categories[categoryIndex].images,
                                  imageIndex,
                                  imageIndex + 1,
                                );
                              })
                            }
                            disabled={imageIndex === category.images.length - 1}
                            aria-label={c.moveDown}
                            title={c.moveDown}
                          >
                            ↓
                          </button>
                        </div>
                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            change((draft) => {
                              draft.categories[categoryIndex].images.splice(
                                imageIndex,
                                1,
                              );
                            })
                          }
                        >
                          {c.delete}
                        </button>
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "articles" && (
          <div className="cmsManagerPanel">
            <button
              type="button"
              className="cmsManagerAdd"
              onClick={addArticle}
            >
              + {c.addArticle}
            </button>
            {draft.articles.length === 0 && (
              <p className="cmsManagerEmpty">{c.emptyArticles}</p>
            )}
            {draft.articles.map((article, articleIndex) => (
              <article className="cmsManagerCard" key={article.id}>
                <header>
                  <strong>{String(articleIndex + 1).padStart(2, "0")}</strong>
                  <div className="cmsMoveButtons">
                    <button
                      type="button"
                      onClick={() =>
                        change((draft) => {
                          moveItem(
                            draft.articles,
                            articleIndex,
                            articleIndex - 1,
                          );
                        })
                      }
                      disabled={articleIndex === 0}
                      aria-label={c.moveUp}
                      title={c.moveUp}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        change((draft) => {
                          moveItem(
                            draft.articles,
                            articleIndex,
                            articleIndex + 1,
                          );
                        })
                      }
                      disabled={articleIndex === draft.articles.length - 1}
                      aria-label={c.moveDown}
                      title={c.moveDown}
                    >
                      ↓
                    </button>
                  </div>
                  <a
                    href={`/texty/${article.slug}?edit=1${
                      locale === "cs" ? "" : `&lang=${locale}`
                    }`}
                  >
                    Otevřít ↗
                  </a>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      if (!confirm(`Smazat článek „${article.title}“?`)) return;
                      change((draft) => {
                        draft.articles.splice(articleIndex, 1);
                      });
                    }}
                  >
                    {c.delete}
                  </button>
                </header>
                <div className="cmsManagerFields">
                  <label>
                    Název
                    <input
                      value={article.title}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].title =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Adresa článku
                    <input
                      value={article.slug}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].slug = slugify(
                            event.target.value,
                          );
                        })
                      }
                    />
                  </label>
                  <label>
                    Kicker
                    <input
                      value={article.kicker}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].kicker =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Datum
                    <input
                      value={article.date}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].date =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label className="wide">
                    Perex
                    <textarea
                      rows={3}
                      value={article.dek}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].dek =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label className="wide">
                    Teze
                    <textarea
                      rows={3}
                      value={article.thesis}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].thesis =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Obrázek
                    <input
                      value={article.cover}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].cover =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Alt obrázku
                    <input
                      value={article.coverAlt}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].coverAlt =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label className="wide cmsManagerCover">
                    <img src={article.cover} alt="" />
                    {uploading === `article:${article.id}`
                      ? "Nahrávám…"
                      : c.replaceImage}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={Boolean(uploading)}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (!file) return;
                        void uploadFiles(
                          [file],
                          `article:${article.id}`,
                          ([item]) =>
                            change((draft) => {
                              draft.articles[articleIndex].cover = item.src;
                              if (
                                !draft.articles[articleIndex].coverAlt.trim()
                              ) {
                                draft.articles[articleIndex].coverAlt =
                                  item.file.name.replace(/\.[^.]+$/, "");
                              }
                            }),
                        );
                      }}
                    />
                  </label>
                  <label className="wide">
                    Text článku
                    <small>
                      Každá kapitola začíná řádkem <code>## Nadpis</code>.
                    </small>
                    <textarea
                      rows={18}
                      value={articleBody(article)}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].sections =
                            parseArticleBody(
                              event.target.value,
                              draft.articles[articleIndex].sections,
                            );
                        })
                      }
                    />
                  </label>
                  <label className="wide">
                    Zdroje
                    <small>
                      Jeden zdroj na řádek: číslo | název | autor | URL |
                      poznámka
                    </small>
                    <textarea
                      rows={6}
                      value={sourcesBody(article)}
                      onChange={(event) =>
                        change((draft) => {
                          draft.articles[articleIndex].sources = parseSources(
                            event.target.value,
                            draft.articles[articleIndex].sources,
                          );
                        })
                      }
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "buttons" && (
          <div className="cmsManagerPanel">
            <button
              type="button"
              className="cmsManagerAdd"
              onClick={addButton}
            >
              + {c.addButton}
            </button>
            {draft.buttons.length === 0 && (
              <p className="cmsManagerEmpty">{c.emptyButtons}</p>
            )}
            {draft.buttons.map((button, buttonIndex) => (
              <article className="cmsManagerCard" key={button.id}>
                <header>
                  <strong>{String(buttonIndex + 1).padStart(2, "0")}</strong>
                  <div className="cmsMoveButtons">
                    <button
                      type="button"
                      onClick={() =>
                        change((draft) => {
                          moveItem(
                            draft.buttons,
                            buttonIndex,
                            buttonIndex - 1,
                          );
                        })
                      }
                      disabled={buttonIndex === 0}
                      aria-label={c.moveUp}
                      title={c.moveUp}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        change((draft) => {
                          moveItem(
                            draft.buttons,
                            buttonIndex,
                            buttonIndex + 1,
                          );
                        })
                      }
                      disabled={buttonIndex === draft.buttons.length - 1}
                      aria-label={c.moveDown}
                      title={c.moveDown}
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      change((draft) => {
                        draft.buttons.splice(buttonIndex, 1);
                      })
                    }
                  >
                    {c.delete}
                  </button>
                </header>
                <div className="cmsManagerFields cmsButtonFields">
                  <label>
                    Text tlačítka
                    <input
                      value={button.label}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].label =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Odkaz
                    <input
                      value={button.href}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].href =
                            event.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Umístění
                    <select
                      value={button.location}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].location = event.target
                            .value as typeof button.location;
                        })
                      }
                    >
                      <option value="hero">Úvod webu</option>
                      <option value="essays">U článků</option>
                      <option value="contact">U kontaktu</option>
                    </select>
                  </label>
                  <label>
                    Vzhled
                    <select
                      value={button.style}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].style = event.target
                            .value as typeof button.style;
                        })
                      }
                    >
                      <option value="strong">Výrazné</option>
                      <option value="quiet">Vedlejší</option>
                    </select>
                  </label>
                  <label>
                    Otevření
                    <select
                      value={button.target}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].target = event.target
                            .value as typeof button.target;
                        })
                      }
                    >
                      <option value="new">Nová karta</option>
                      <option value="same">Stejná karta</option>
                    </select>
                  </label>
                  <label>
                    Rámování
                    <select
                      value={button.frame ?? "none"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].frame = event.target
                            .value as typeof button.frame;
                        })
                      }
                    >
                      <option value="none">Bez rámu</option>
                      <option value="line">Tenká linka</option>
                      <option value="heavy">Silný rám</option>
                      <option value="shadow">Rám + stín</option>
                    </select>
                  </label>
                  <label>
                    Tvar
                    <select
                      value={button.shape ?? "square"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].shape = event.target
                            .value as typeof button.shape;
                        })
                      }
                    >
                      <option value="square">Hranaté</option>
                      <option value="soft">Jemně zakulacené</option>
                      <option value="pill">Pilulka</option>
                    </select>
                  </label>
                  <label>
                    Šířka
                    <select
                      value={button.width ?? "auto"}
                      onChange={(event) =>
                        change((draft) => {
                          draft.buttons[buttonIndex].width = event.target
                            .value as typeof button.width;
                        })
                      }
                    >
                      <option value="auto">Podle textu</option>
                      <option value="full">Celá šířka</option>
                    </select>
                  </label>
                  <div className="cmsColorFields wide">
                    <label>
                      Barva tlačítka
                      <input
                        type="color"
                        value={button.backgroundColor ?? "#ed2859"}
                        onChange={(event) =>
                          change((draft) => {
                            draft.buttons[buttonIndex].backgroundColor =
                              event.target.value;
                          })
                        }
                      />
                    </label>
                    <label>
                      Barva textu
                      <input
                        type="color"
                        value={button.textColor ?? "#ffffff"}
                        onChange={(event) =>
                          change((draft) => {
                            draft.buttons[buttonIndex].textColor =
                              event.target.value;
                          })
                        }
                      />
                    </label>
                    <label>
                      Barva rámu
                      <input
                        type="color"
                        value={button.borderColor ?? "#ed2859"}
                        onChange={(event) =>
                          change((draft) => {
                            draft.buttons[buttonIndex].borderColor =
                              event.target.value;
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <footer className="cmsManagerFooter">
          <span>
            {changed
              ? locale === "cs"
                ? "Změny zatím nejsou použité."
                : locale === "en"
                  ? "Changes have not been applied yet."
                  : "Зміни ще не застосовано."
              : locale === "cs"
                ? "Beze změn."
                : locale === "en"
                  ? "No changes."
                  : "Без змін."}
          </span>
          <button type="button" className="cmsManagerCancel" onClick={close}>
            {c.cancel}
          </button>
          <button
            type="button"
            className="cmsManagerSave"
            onClick={saveAndClose}
            disabled={!changed || Boolean(uploading)}
          >
            {c.save}
          </button>
        </footer>
      </section>
    </div>
  );
}
