import { destinationHref, exploreEntries, readingDocuments, therapyDocuments } from '@/content/explore';
import { getHereNowEntry } from '@/content/hereNow';

describe('Explore content contracts', () => {
  it('keeps every Explore destination inside the native route map', () => {
    for (const entry of exploreEntries) {
      expect(entry.href.startsWith('/')).toBe(true);
      expect(entry.href.startsWith('http')).toBe(false);
    }
  });

  it('resolves saved editorial documents back to their native routes', () => {
    for (const document of Object.values(readingDocuments)) {
      expect(destinationHref(document)).toBe(`/reading/${document.slug}`);
    }
    for (const document of Object.values(therapyDocuments)) {
      expect(destinationHref(document)).toBe(`/therapy/${document.slug}`);
    }
  });

  it('uses the audited canonical lecture and therapy paths', () => {
    expect(readingDocuments['recovery-as-a-dynamic-system']?.canonicalPath).toBe('/lectures/26-healing-re-expansion');
    expect(readingDocuments['when-tomorrow-cannot-compete']?.canonicalPath).toBe('/lectures/42-when-tomorrow-cannot-compete');
    expect(readingDocuments['trust-after-addiction']?.canonicalPath).toBe('/lectures/trust-after-addiction');
    expect(therapyDocuments.act?.canonicalPath).toBe('/psychotherapy/acceptance-commitment-therapy');
    expect(therapyDocuments.dbt?.canonicalPath).toBe('/psychotherapy/dialectical-behavior-therapy');
    expect(therapyDocuments['motivational-interviewing']?.canonicalPath).toBe('/psychotherapy/motivational-relapse-contingency');
  });
});

describe('Here and Now fallback', () => {
  it('is deterministic for a date and preserves bilingual parity', () => {
    const first = getHereNowEntry('2026-08-08');
    const second = getHereNowEntry('2026-08-08');

    expect(first).toEqual(second);
    expect(first.date).toBe('2026-08-08');
    expect(first.reflection.length).toBeGreaterThanOrEqual(3);
    expect(first.title.en.length).toBeGreaterThan(0);
    expect(first.title.he.length).toBeGreaterThan(0);
    expect(first.action.every((step) => step.en.length > 0 && step.he.length > 0)).toBe(true);
  });

  it('changes the independent daily entry across adjacent dates', () => {
    expect(getHereNowEntry('2026-08-08').title).not.toEqual(getHereNowEntry('2026-08-09').title);
  });
});
