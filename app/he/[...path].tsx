import { type Href, Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useSettingsStore } from '@/state/settingsStore';

export default function HebrewCanonicalAlias() {
  const { path: routePath } = useLocalSearchParams<{ path?: string | string[] }>();
  const setLocale = useSettingsStore((state) => state.setLocale);
  useEffect(() => setLocale('he'), [setLocale]);

  const segments = (Array.isArray(routePath) ? routePath : routePath ? [routePath] : []).filter(Boolean);
  if (!segments.length) return <Redirect href='/(tabs)/now' />;
  const [first, second] = segments;
  if (first === 'ask') return <Redirect href='/(tabs)/ask' />;
  if (first === 'field') return <Redirect href='/(tabs)/field' />;
  if (first === 'today') return <Redirect href={(second ? `/today/${second}` : '/here-now') as Href} />;
  if (first === 'atlas') return <Redirect href='/atlas' />;
  if (first === 'neuromodulation') return <Redirect href='/neuromodulation' />;
  if (first === 'research') return <Redirect href='/research' />;
  if (first === 'lectures') return <Redirect href={(second ? `/lectures/${second}` : '/lectures') as Href} />;
  if (first === 'psychotherapy') return <Redirect href={(second ? `/psychotherapy/${second}` : '/psychotherapy') as Href} />;
  if (segments.length === 1 && first === 'about') return <Redirect href='/reading/framework-and-journey' />;
  if (segments.length === 1 && first && (/^\d{2}-/.test(first) || first === 'trust-after-addiction')) {
    return <Redirect href={`/lectures/${first}` as Href} />;
  }

  const canonicalPath = `/he/${segments.join('/')}`;
  const title = segments.at(-1)?.replaceAll('-', ' ') ?? 'Flow Hijacked';
  const target = `/reading/he-canonical?href=${encodeURIComponent(canonicalPath)}&title=${encodeURIComponent(title)}`;
  return <Redirect href={target as Href} />;
}
