export type EssayCopy = {
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  date: string;
  coverAlt: string;
  thesis: string;
  sections: { title: string; paragraphs: string[]; imageAlt?: string }[];
  sourceNotes: string[];
};
