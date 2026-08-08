import { HybridContent } from '@/components/HybridContent';
import { ReadingShell } from '@/components/ReadingShell';
import type { ContentDestination } from '@/types/content';

const destination: ContentDestination = {
  id: 'canonical-therapy-library',
  kind: 'therapy',
  title: { en: 'Complete Therapy Routes library', he: 'ספריית מסלולי הטיפול המלאה' },
  subtitle: { en: 'Compare mechanisms, fit, evidence and safety boundaries', he: 'להשוות מנגנונים, התאמה, ראיות וגבולות בטיחות' },
  canonicalPath: '/psychotherapy',
};

export default function PsychotherapyLibraryScreen() {
  return (
    <ReadingShell destination={destination} eyebrow='Flow Hijacked · Therapy Routes'>
      <HybridContent canonicalPath='/psychotherapy' title={destination.title.en} />
    </ReadingShell>
  );
}
