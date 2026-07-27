import { essays, type Essay } from "./data";
import { enEssayCopies } from "./translations-en";
import { ukEssayCopies } from "./translations-uk";
import type { Locale } from "../i18n";
import type { EssayCopy } from "./translation-types";

const copies: Record<Exclude<Locale, "cs">, EssayCopy[]> = {
  en: enEssayCopies,
  uk: ukEssayCopies,
};

function mergeEssay(base: Essay, copy: EssayCopy): Essay {
  return {
    ...base,
    kicker: copy.kicker,
    title: copy.title,
    dek: copy.dek,
    date: copy.date,
    coverAlt: copy.coverAlt,
    thesis: copy.thesis,
    sections: base.sections.map((section, index) => ({
      ...section,
      title: copy.sections[index]?.title ?? section.title,
      paragraphs: copy.sections[index]?.paragraphs ?? section.paragraphs,
      imageAlt: copy.sections[index]?.imageAlt ?? section.imageAlt,
    })),
    sources: base.sources.map((source, index) => ({
      ...source,
      note: copy.sourceNotes[index] ?? source.note,
    })),
  };
}

export function getLocalizedEssays(locale: Locale): Essay[] {
  if (locale === "cs") return essays;
  const bySlug = new Map(copies[locale].map((copy) => [copy.slug, copy]));
  return essays.map((essay) => {
    const copy = bySlug.get(essay.slug);
    return copy ? mergeEssay(essay, copy) : essay;
  });
}

export function getLocalizedEssay(slug: string, locale: Locale): Essay | undefined {
  return getLocalizedEssays(locale).find((essay) => essay.slug === slug);
}
