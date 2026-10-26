import type { Bilingual } from './recovery';

export type ContentKind =
  | 'lecture'
  | 'research'
  | 'therapy'
  | 'neuromodulation'
  | 'concept'
  | 'here_and_now'
  | 'ask_answer';

export interface ContentDestination {
  id: string;
  kind: ContentKind;
  title: Bilingual;
  subtitle: Bilingual;
  canonicalPath: string;
  sectionId?: string;
  readingMinutes?: number;
}

export interface SavedItem extends ContentDestination {
  savedAt: string;
  progress?: number;
  lastOpenedAt?: string;
}

export interface ContinuityItem extends ContentDestination {
  reason: Bilingual;
  lastOpenedAt: string;
  progress?: number;
}

export interface HereNowEntry {
  date: string;
  title: Bilingual;
  reflection: Bilingual[];
  coreSentence: Bilingual;
  actionTitle: Bilingual;
  action: Bilingual[];
  scientificLayer: Bilingual;
  therapyLayer: Bilingual;
  lovedOneLayer: Bilingual;
}
