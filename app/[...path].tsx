import { useLocalSearchParams } from 'expo-router';

import { HybridContent } from '@/components/HybridContent';
import { ReadingShell } from '@/components/ReadingShell';
import type { ContentDestination } from '@/types/content';

export default function CanonicalCatchAll() {
  const { path: routePath } = useLocalSearchParams<{ path?: string | string[] }>();
  const segments = (Array.isArray(routePath) ? routePath : routePath ? [routePath] : []).filter(Boolean);
  const canonicalPath = `/${segments.join('/')}`;
  const readable = segments.at(-1)?.replaceAll('-', ' ') ?? 'Flow Hijacked';
  const destination: ContentDestination = {
    id: `canonical-${canonicalPath}`,
    kind: 'concept',
    title: { en: readable, he: readable },
    subtitle: {
      en: 'Canonical Flow Hijacked material in the application reading shell',
      he: 'תוכן קנוני של Flow Hijacked בתוך מעטפת הקריאה של האפליקציה',
    },
    canonicalPath,
  };
  return (
    <ReadingShell destination={destination} eyebrow='Flow Hijacked · canonical'>
      <HybridContent canonicalPath={canonicalPath} title={readable} />
    </ReadingShell>
  );
}

