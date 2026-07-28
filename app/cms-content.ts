export type CmsImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  protectedPreview?: boolean;
};

export type CmsCategory = {
  id: string;
  title: string;
  description: string;
  images: CmsImage[];
  layout?: "strip" | "grid" | "feature";
  frame?: "none" | "line" | "heavy" | "shadow";
  imageFit?: "cover" | "contain";
  imageRatio?: "landscape" | "square" | "portrait";
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
};

export type CmsArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
};

export type CmsArticleSource = {
  id: string;
  n: string;
  title: string;
  author: string;
  url: string;
  note: string;
};

export type CmsArticle = {
  id: string;
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  date: string;
  cover: string;
  coverAlt: string;
  thesis: string;
  sections: CmsArticleSection[];
  sources: CmsArticleSource[];
};

export type CmsButton = {
  id: string;
  label: string;
  href: string;
  location: "hero" | "essays" | "contact";
  style: "strong" | "quiet";
  target: "new" | "same";
  frame?: "none" | "line" | "heavy" | "shadow";
  shape?: "square" | "soft" | "pill";
  width?: "auto" | "full";
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

export type CmsContent = {
  categories: CmsCategory[];
  articles: CmsArticle[];
  buttons: CmsButton[];
  categoryOrder?: string[];
};

export const emptyCmsContent = (): CmsContent => ({
  categories: [],
  articles: [],
  buttons: [],
});

function isString(value: unknown, maximum = 20_000): value is string {
  return typeof value === "string" && value.length <= maximum;
}

function hasId(value: unknown): value is { id: string } {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    isString((value as { id?: unknown }).id, 120) &&
    (value as { id: string }).id.length > 0
  );
}

function validImage(value: unknown): value is CmsImage {
  if (!hasId(value)) return false;
  const image = value as Partial<CmsImage>;
  return (
    isString(image.src, 2_000) &&
    isString(image.alt, 2_000) &&
    isString(image.title, 2_000) &&
    isString(image.caption) &&
    (image.protectedPreview === undefined ||
      typeof image.protectedPreview === "boolean")
  );
}

function validCategory(value: unknown): value is CmsCategory {
  if (!hasId(value)) return false;
  const category = value as Partial<CmsCategory>;
  return (
    isString(category.title, 2_000) &&
    isString(category.description) &&
    Array.isArray(category.images) &&
    category.images.length <= 100 &&
    category.images.every(validImage) &&
    (category.layout === undefined ||
      ["strip", "grid", "feature"].includes(category.layout)) &&
    (category.frame === undefined ||
      ["none", "line", "heavy", "shadow"].includes(category.frame)) &&
    (category.imageFit === undefined ||
      ["cover", "contain"].includes(category.imageFit)) &&
    (category.imageRatio === undefined ||
      ["landscape", "square", "portrait"].includes(category.imageRatio)) &&
    (category.columns === undefined ||
      [2, 3, 4].includes(category.columns)) &&
    (category.backgroundColor === undefined ||
      validColor(category.backgroundColor)) &&
    (category.textColor === undefined || validColor(category.textColor)) &&
    (category.accentColor === undefined || validColor(category.accentColor))
  );
}

function validSection(value: unknown): value is CmsArticleSection {
  if (!hasId(value)) return false;
  const section = value as Partial<CmsArticleSection>;
  return (
    isString(section.title, 2_000) &&
    Array.isArray(section.paragraphs) &&
    section.paragraphs.length <= 200 &&
    section.paragraphs.every((paragraph) => isString(paragraph)) &&
    (section.image === undefined || isString(section.image, 2_000)) &&
    (section.imageAlt === undefined || isString(section.imageAlt, 2_000))
  );
}

function validSource(value: unknown): value is CmsArticleSource {
  if (!hasId(value)) return false;
  const source = value as Partial<CmsArticleSource>;
  return (
    isString(source.n, 40) &&
    isString(source.title, 2_000) &&
    isString(source.author, 2_000) &&
    isString(source.url, 2_000) &&
    isString(source.note)
  );
}

function validArticle(value: unknown): value is CmsArticle {
  if (!hasId(value)) return false;
  const article = value as Partial<CmsArticle>;
  return (
    isString(article.slug, 120) &&
    article.slug.length > 0 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) &&
    isString(article.kicker, 2_000) &&
    isString(article.title, 2_000) &&
    isString(article.dek) &&
    isString(article.date, 200) &&
    isString(article.cover, 2_000) &&
    isString(article.coverAlt, 2_000) &&
    isString(article.thesis) &&
    Array.isArray(article.sections) &&
    article.sections.length > 0 &&
    article.sections.length <= 100 &&
    article.sections.every(validSection) &&
    Array.isArray(article.sources) &&
    article.sources.length <= 100 &&
    article.sources.every(validSource)
  );
}

function validButton(value: unknown): value is CmsButton {
  if (!hasId(value)) return false;
  const button = value as Partial<CmsButton>;
  return (
    isString(button.label, 500) &&
    isString(button.href, 2_000) &&
    ["hero", "essays", "contact"].includes(button.location ?? "") &&
    ["strong", "quiet"].includes(button.style ?? "") &&
    ["new", "same"].includes(button.target ?? "") &&
    (button.frame === undefined ||
      ["none", "line", "heavy", "shadow"].includes(button.frame)) &&
    (button.shape === undefined ||
      ["square", "soft", "pill"].includes(button.shape)) &&
    (button.width === undefined ||
      ["auto", "full"].includes(button.width)) &&
    (button.backgroundColor === undefined ||
      validColor(button.backgroundColor)) &&
    (button.textColor === undefined || validColor(button.textColor)) &&
    (button.borderColor === undefined || validColor(button.borderColor))
  );
}

function validColor(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^#[0-9a-f]{6}$/i.test(value)
  );
}

export function isCmsContent(value: unknown): value is CmsContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<CmsContent>;
  return (
    Array.isArray(content.categories) &&
    content.categories.length <= 50 &&
    content.categories.every(validCategory) &&
    Array.isArray(content.articles) &&
    content.articles.length <= 100 &&
    content.articles.every(validArticle) &&
    new Set(content.articles.map((article) => article.slug)).size ===
      content.articles.length &&
    Array.isArray(content.buttons) &&
    content.buttons.length <= 100 &&
    content.buttons.every(validButton) &&
    (content.categoryOrder === undefined ||
      (Array.isArray(content.categoryOrder) &&
        content.categoryOrder.length <= 100 &&
        content.categoryOrder.every((id) => isString(id, 120)) &&
        new Set(content.categoryOrder).size === content.categoryOrder.length))
  );
}
