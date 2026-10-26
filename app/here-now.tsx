import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ReadingShell } from '@/components/ReadingShell';
import { Eyebrow, FlowText } from '@/components/Typography';
import { getHereNowEntry } from '@/content/hereNow';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { colors, spacing, touch } from '@/theme/tokens';
import type { Bilingual } from '@/types/recovery';
import { localize } from '@/utils/bilingual';

const copy = {
  fiveMinutes: { en: 'Today’s five-minute reflection', he: 'הקריאה של היום · כחמש דקות' },
  independent: {
    en: 'This day stands on its own. Nothing was missed and nothing is owed.',
    he: 'היום הזה עומד בפני עצמו. לא פספסתם דבר ואינכם חייבים להשלים דבר.',
  },
  practice: { en: 'A small practice, not an assignment', he: 'תרגול קטן, לא מטלה' },
  layersLead: {
    en: 'Open only the lens that is useful now.',
    he: 'פתחו רק את העדשה שמועילה לכם עכשיו.',
  },
  scientific: { en: 'Scientific lens', he: 'העדשה המדעית' },
  therapy: { en: 'Therapy lens', he: 'העדשה הטיפולית' },
  lovedOne: { en: 'For someone who cares', he: 'לאדם קרוב שאכפת לו' },
} as const;

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function HereNowScreen() {
  const { locale } = useLocale();
  const date = new Date();
  const dateKey = localDateKey(date);
  const entry = getHereNowEntry(dateKey);
  const formattedDate = new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
  const destination = {
    id: `here-now-${dateKey}`,
    kind: 'here_and_now' as const,
    title: entry.title,
    subtitle: copy.fiveMinutes,
    canonicalPath: '/today',
    readingMinutes: 5,
  };

  const askPrompt = locale === 'he'
    ? `העמק ברעיון של כאן ועכשיו להיום: “${localize(entry.coreSentence, locale)}”`
    : `Explore today's Here and Now idea more deeply: “${localize(entry.coreSentence, locale)}”`;

  return (
    <ReadingShell
      destination={destination}
      eyebrow={`${tr('hereNow', locale)} · ${formattedDate}`}
      warm
      questionPrompt={askPrompt}
      fieldPrompt={locale === 'he' ? 'האם התרגול של היום מתאים למה שזמין בשדה שלי כרגע?' : 'Does today’s practice fit what is available in my field right now?'}
    >
      <View style={styles.independent}>
        <FlowText variant='bodySmall' tone='muted'>{localize(copy.independent, locale)}</FlowText>
      </View>

      <View style={styles.reflection}>
        {entry.reflection.map((paragraph, index) => (
          <FlowText key={`reflection-${index}`} serif style={styles.body}>{localize(paragraph, locale)}</FlowText>
        ))}
      </View>

      <View style={styles.coreSentence}>
        <Eyebrow tone='gold'>{tr('coreSentence', locale)}</Eyebrow>
        <FlowText variant='sectionTitle' serif>{localize(entry.coreSentence, locale)}</FlowText>
      </View>

      <View style={styles.practice}>
        <Eyebrow tone='gold'>{localize(copy.practice, locale)}</Eyebrow>
        <FlowText variant='sectionTitle' serif accessibilityRole='header'>{localize(entry.actionTitle, locale)}</FlowText>
        <View style={styles.steps}>
          {entry.action.map((step, index) => (
            <View key={`step-${index}`} style={styles.step}>
              <FlowText variant='metadata' tone='gold'>{String(index + 1).padStart(2, '0')}</FlowText>
              <FlowText style={styles.stepText}>{localize(step, locale)}</FlowText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.layers}>
        <View style={styles.layerHeading}>
          <FlowText variant='sectionTitle' serif accessibilityRole='header'>{tr('deeperLayers', locale)}</FlowText>
          <FlowText tone='secondary'>{localize(copy.layersLead, locale)}</FlowText>
        </View>
        <LayerDisclosure title={copy.scientific} body={entry.scientificLayer} tone='science' />
        <LayerDisclosure title={copy.therapy} body={entry.therapyLayer} tone='therapy' />
        <LayerDisclosure title={copy.lovedOne} body={entry.lovedOneLayer} tone='human' />
      </View>
    </ReadingShell>
  );
}

function LayerDisclosure({ title, body, tone }: { title: Bilingual; body: Bilingual; tone: 'science' | 'therapy' | 'human' }) {
  const [open, setOpen] = useState(false);
  const { locale } = useLocale();
  return (
    <View style={[styles.layer, styles[`${tone}Layer`]]}>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.layerButton, pressed && styles.pressed]}
      >
        <FlowText style={styles.layerTitle}>{localize(title, locale)}</FlowText>
        <FlowText tone={tone === 'human' ? 'gold' : 'teal'} accessibilityElementsHidden>{open ? '−' : '+'}</FlowText>
      </Pressable>
      {open ? <FlowText serif tone='secondary' style={styles.layerBody}>{localize(body, locale)}</FlowText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  independent: { paddingVertical: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  reflection: { gap: spacing.xl },
  body: { fontSize: 19, lineHeight: 32 },
  coreSentence: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderStartWidth: 2,
    borderStartColor: colors.gold,
    backgroundColor: 'rgba(212,180,138,0.06)',
    gap: spacing.md,
  },
  practice: { gap: spacing.md },
  steps: { marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line },
  step: {
    minHeight: touch.primaryHeight,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepText: { flex: 1 },
  layers: { gap: 0 },
  layerHeading: { gap: spacing.sm, marginBottom: spacing.lg },
  layer: { borderStartWidth: 2, borderBottomWidth: 1, borderBottomColor: colors.line },
  scienceLayer: { borderStartColor: colors.teal },
  therapyLayer: { borderStartColor: colors.blue },
  humanLayer: { borderStartColor: colors.warm },
  layerButton: {
    minHeight: touch.primaryHeight,
    paddingVertical: spacing.md,
    paddingStart: spacing.lg,
    paddingEnd: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  layerTitle: { flex: 1, fontWeight: '600' },
  layerBody: { paddingStart: spacing.lg, paddingEnd: spacing.sm, paddingBottom: spacing.xl },
  pressed: { opacity: 0.72 },
});
