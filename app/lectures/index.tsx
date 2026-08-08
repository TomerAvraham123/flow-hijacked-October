import { HybridContent } from '@/components/HybridContent';
import { ReadingShell } from '@/components/ReadingShell';
import type { ContentDestination } from '@/types/content';

const destination: ContentDestination = {
  id: 'canonical-lectures-library',
  kind: 'lecture',
  title: { en: 'Complete lecture library', he: 'ספריית ההרצאות המלאה' },
  subtitle: { en: 'The maintained Flow Hijacked long-form collection', he: 'האוסף המתעדכן של הקריאה הארוכה ב־Flow Hijacked' },
  canonicalPath: '/lectures',
};

export default function LecturesLibraryScreen() {
  return (
    <ReadingShell destination={destination} eyebrow='Flow Hijacked · lectures'>
      <HybridContent canonicalPath='/lectures' title={destination.title.en} />
    </ReadingShell>
  );
}
