import type { Bilingual, Locale } from '@/types/recovery';

export function localize(value: Bilingual, locale: Locale): string {
  return value[locale];
}

export function isRtl(locale: Locale): boolean {
  return locale === 'he';
}

export function localePath(path: string, locale: Locale): string {
  if (locale === 'en') return path;
  if (path === '/') return '/he';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/he' || normalized.startsWith('/he/')) return normalized;

  // Lecture editions are the one canonical-site exception: English lives at
  // /lectures/:slug while Hebrew lives at /he/:slug (without /lectures).
  const lectureMatch = normalized.match(/^\/lectures\/([^?#/]+)([?#].*)?$/);
  if (lectureMatch?.[1]) return `/he/${lectureMatch[1]}${lectureMatch[2] ?? ''}`;

  return `/he${normalized}`;
}
