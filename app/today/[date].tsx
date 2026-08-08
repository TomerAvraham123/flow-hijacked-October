import { useLocalSearchParams } from 'expo-router';

import { HybridContent } from '@/components/HybridContent';
import { ReadingShell } from '@/components/ReadingShell';
import type { ContentDestination } from '@/types/content';

export default function DatedHereNowAlias() {
  const { date: routeDate } = useLocalSearchParams<{ date?: string | string[] }>();
  const rawDate = Array.isArray(routeDate) ? routeDate[0] : routeDate;
  const date = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : 'archive';
  const destination: ContentDestination = {
    id: `here-now-archive-${date}`,
    kind: 'here_and_now',
    title: { en: `Here and Now · ${date}`, he: `כאן ועכשיו · ${date}` },
    subtitle: { en: 'A dated independent reflection', he: 'קריאה יומית שעומדת בפני עצמה' },
    canonicalPath: `/today/${date}`,
    readingMinutes: 5,
  };
  return (
    <ReadingShell destination={destination} warm eyebrow='Here and Now · archive'>
      <HybridContent canonicalPath={destination.canonicalPath} title={destination.title.en} />
    </ReadingShell>
  );
}

