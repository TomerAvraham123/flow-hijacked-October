import { type Href, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ReadingShell } from '@/components/ReadingShell';
import { Eyebrow, FlowText } from '@/components/Typography';
import { researchTopics, type ResearchTopic } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { useContinuityStore } from '@/state/continuityStore';
import { colors, radii, spacing, touch } from '@/theme/tokens';
import type { ContentDestination } from '@/types/content';
import { localize } from '@/utils/bilingual';

const destination: ContentDestination = {
  id: 'research-map',
  kind: 'research',
  title: { en: 'Research', he: 'מחקר' },
  subtitle: {
    en: 'What evidence supports, what it cannot settle and where a better question begins',
    he: 'במה הראיות תומכות, מה הן אינן יכולות להכריע, ואיפה מתחילה שאלה טובה יותר',
  },
  canonicalPath: '/research',
  readingMinutes: 11,
};

const copy = {
  eyebrow: { en: 'Evidence map', he: 'מפת ראיות' },
  boundary: {
    en: 'Research becomes more useful when observations, associations and inferences remain visibly distinct. These summaries are starting points into the maintained Flow Hijacked corpus, not a live ranking of headlines.',
    he: 'מחקר נעשה מועיל יותר כשמבדילים בגלוי בין תצפית, קשר סטטיסטי והסקה. הסיכומים כאן הם נקודות כניסה לקורפוס המתעדכן של Flow Hijacked, לא דירוג חי של כותרות.',
  },
  question: { en: 'Question', he: 'השאלה' },
  supports: { en: 'What it supports', he: 'במה הראיות תומכות' },
  notSupport: { en: 'What it does not establish', he: 'מה הראיות אינן מוכיחות' },
  matters: { en: 'Why it matters here', he: 'למה זה חשוב כאן' },
  open: { en: 'Open research note', he: 'לפתוח את הערת המחקר' },
  close: { en: 'Close research note', he: 'לסגור את הערת המחקר' },
  save: { en: 'Save this topic', he: 'לשמור את הנושא' },
  saved: { en: 'Saved', he: 'נשמר' },
  ask: { en: 'Ask what this evidence actually supports', he: 'לשאול במה הראיות באמת תומכות' },
} as const;

export default function ResearchScreen() {
  const { locale } = useLocale();
  return (
    <ReadingShell
      destination={destination}
      eyebrow={copy.eyebrow[locale]}
      questionPrompt={locale === 'he' ? 'עזור לי להבחין בין תצפית, קשר, הסקה וסיבתיות במחקר שרלוונטי ל־Flow Hijacked.' : 'Help me distinguish observation, association, inference and causality in research relevant to Flow Hijacked.'}
    >
      <View style={styles.boundary}>
        <Eyebrow tone='gold'>{locale === 'he' ? 'איך לקרוא את המפה' : 'How to read this map'}</Eyebrow>
        <FlowText tone='secondary'>{copy.boundary[locale]}</FlowText>
      </View>

      <View style={styles.topicList}>
        {researchTopics.map((topic, index) => (
          <ResearchTopicDisclosure key={topic.id} topic={topic} index={index + 1} />
        ))}
      </View>

      <Pressable
        accessibilityRole='button'
        onPress={() => router.push('/reading/canonical-research?href=%2Fresearch&title=Research%20Library' as Href)}
        style={({ pressed }) => [styles.libraryAction, pressed && styles.pressed]}
      >
        <View style={styles.libraryCopy}>
          <Eyebrow tone='gold'>{locale === 'he' ? 'הספרייה המתעדכנת' : 'THE MAINTAINED LIBRARY'}</Eyebrow>
          <FlowText variant='subheading'>{locale === 'he' ? 'לפתוח את עוגני המחקר וקישורי ה־DOI' : 'Open the full research anchors and DOI links'}</FlowText>
        </View>
        <FlowText tone='gold' accessibilityElementsHidden>↗</FlowText>
      </Pressable>
    </ReadingShell>
  );
}

function ResearchTopicDisclosure({ topic, index }: { topic: ResearchTopic; index: number }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(index === 1);
  const savedItem = useContinuityStore((state) => state.saved.find((item) => item.id === topic.id));
  const save = useContinuityStore((state) => state.save);
  const remove = useContinuityStore((state) => state.remove);
  const title = localize(topic.title, locale);

  const askPrompt = locale === 'he'
    ? `מה המחקר בנושא “${title}” באמת מאפשר להסיק, מה עדיין אינו ברור, ואיך הוא קשור להתמכרות ולהחלמה?`
    : `What does research on “${title}” actually allow us to conclude, what remains uncertain, and how does it relate to addiction and recovery?`;

  return (
    <View style={styles.topic}>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.topicHeader, pressed && styles.pressed]}
      >
        <FlowText variant='metadata' tone='muted'>{String(index).padStart(2, '0')}</FlowText>
        <View style={styles.topicHeaderCopy}>
          <FlowText variant='subheading' serif>{title}</FlowText>
          <FlowText variant='bodySmall' tone='secondary'>{localize(topic.subtitle, locale)}</FlowText>
          <FlowText variant='metadata' tone='teal'>{open ? copy.close[locale] : copy.open[locale]}</FlowText>
        </View>
        <FlowText tone='teal' accessibilityElementsHidden>{open ? '−' : '+'}</FlowText>
      </Pressable>

      {open ? (
        <View style={styles.topicBody}>
          <EvidenceBlock label={copy.question[locale]} body={localize(topic.question, locale)} tone='question' />
          <EvidenceBlock label={copy.supports[locale]} body={localize(topic.whatItSupports, locale)} tone='supports' />
          <EvidenceBlock label={copy.notSupport[locale]} body={localize(topic.whatItDoesNotSupport, locale)} tone='boundary' />
          <EvidenceBlock label={copy.matters[locale]} body={localize(topic.whyItMatters, locale)} tone='matters' />
          <View style={styles.topicActions}>
            <Pressable
              accessibilityRole='button'
              accessibilityState={{ selected: Boolean(savedItem) }}
              onPress={() => (savedItem ? remove(topic.id) : save(topic))}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <FlowText variant='bodySmall' style={styles.actionLabel}>{savedItem ? copy.saved[locale] : copy.save[locale]}</FlowText>
              <FlowText tone={savedItem ? 'gold' : 'teal'} accessibilityElementsHidden>{savedItem ? '✓' : '+'}</FlowText>
            </Pressable>
            <Pressable
              accessibilityRole='button'
              onPress={() => router.push(`/(tabs)/ask?q=${encodeURIComponent(askPrompt)}&sourcePath=${encodeURIComponent(topic.canonicalPath)}` as Href)}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <FlowText variant='bodySmall' style={styles.actionLabel}>{copy.ask[locale]}</FlowText>
              <FlowText tone='teal' accessibilityElementsHidden>↗</FlowText>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function EvidenceBlock({ label, body, tone }: { label: string; body: string; tone: 'question' | 'supports' | 'boundary' | 'matters' }) {
  return (
    <View style={[styles.evidenceBlock, styles[`${tone}Block`]]}>
      <Eyebrow tone={tone === 'boundary' ? 'gold' : 'teal'}>{label}</Eyebrow>
      <FlowText>{body}</FlowText>
    </View>
  );
}

const styles = StyleSheet.create({
  boundary: { paddingStart: spacing.lg, paddingVertical: spacing.md, borderStartWidth: 2, borderStartColor: colors.gold, gap: spacing.xs },
  topicList: { borderTopWidth: 1, borderTopColor: colors.line },
  topic: { borderBottomWidth: 1, borderBottomColor: colors.line },
  topicHeader: {
    minHeight: 126,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  topicHeaderCopy: { flex: 1, gap: spacing.xs },
  topicBody: { paddingBottom: spacing.xl, gap: spacing.md },
  evidenceBlock: { paddingStart: spacing.md, paddingVertical: spacing.sm, borderStartWidth: 2, gap: spacing.xs },
  questionBlock: { borderStartColor: colors.blue },
  supportsBlock: { borderStartColor: colors.teal },
  boundaryBlock: { borderStartColor: colors.gold },
  mattersBlock: { borderStartColor: colors.warm },
  topicActions: { gap: spacing.xs, marginTop: spacing.sm },
  secondaryAction: {
    minHeight: touch.primaryHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionLabel: { flex: 1, fontWeight: '600' },
  libraryCopy: { flex: 1, gap: spacing.xs },
  libraryAction: {
    minHeight: touch.primaryHeight,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: { opacity: 0.72 },
});
