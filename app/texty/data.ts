import essayData from "../../content/essays.json";

export type StudyLink = {
  n: string;
  title: string;
  author: string;
  url: string;
  note: string;
};

export type Essay = {
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  read: string;
  date: string;
  cover: string;
  coverAlt: string;
  thesis: string;
  sections: {
    title: string;
    paragraphs: string[];
    image?: string;
    imageAlt?: string;
  }[];
  sources: StudyLink[];
};

export const essays = essayData as Essay[];

export function getEssay(slug: string) {
  return essays.find((essay) => essay.slug === slug);
}
