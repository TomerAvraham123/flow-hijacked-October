import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ReadingShell } from '@/components/ReadingShell';
import { Eyebrow, FlowText } from '@/components/Typography';
import { neuromodulators, type NeuromodulatorEntry } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { colors, radii, spacing, touch } from '@/theme/tokens';
import type { ContentDestination } from '@/types/content';
import { localize } from '@/utils/bilingual';

const destination: ContentDestination = {
  id: 'neuromodulation',
  kind: 'neuromodulation',
  title: { en: 'Neuromodulation', he: 'נוירומודולציה' },
  subtitle: {
    en: 'Transmitters, pathways and changing network conditions',
    he: 'מוליכים עצביים, מסלולים והתנאים המשתנים של הרשת',
  },
  canonicalPath: '/neuromodulation',
  readingMinutes: 12,
};

const copy = {
  eyebrow: { en: 'Scientific layer', he: 'השכבה המדעית' },
  select: { en: 'Choose one system', he: 'בחרו מערכת אחת' },
  selectLead: {
    en: 'The map narrows to one origin, several destinations and the limits of the interpretation.',
    he: 'המפה מצטמצמת למקור אחד, לכמה יעדים ולגבולות של הפרשנות.',
  },
  origin: { en: 'Prominent origins', he: 'מקורות מרכזיים' },
  pathway: { en: 'Selected pathways', he: 'מסלולים נבחרים' },
  role: { en: 'What it helps organize', he: 'מה המערכת עוזרת לארגן' },
  lens: { en: 'Through the recovery lens', he: 'מבעד לעדשת ההחלמה' },
  boundary: { en: 'Interpretive boundary', he: 'גבול הפרשנות' },
  beyondTitle: { en: 'Beyond the chemical shorthand', he: 'מעבר לקיצור הדרך הכימי' },
  beyondBody: {
    en: 'Neurotransmitters are not emotional fluids with a single meaning. Their effect depends on receptor, pathway, timing, baseline state and the network receiving the signal. “More dopamine” or “less serotonin” is rarely an adequate account of a person’s experience.',
    he: 'מוליכים עצביים אינם נוזלים רגשיים בעלי משמעות אחת. ההשפעה שלהם תלויה בקולטן, במסלול, בתזמון, במצב הבסיס וברשת שמקבלת את האות. “יותר דופמין” או “פחות סרוטונין” הם כמעט אף פעם לא הסבר מספק לחוויה של אדם.',
  },
  recoveryTitle: { en: 'Change occurs across timescales', he: 'שינוי מתרחש בכמה טווחי זמן' },
  recoveryBody: {
    en: 'A drug or stimulation pulse can act quickly, while receptor adaptation, learning, sleep, relationships and repeated behavior unfold over different timescales. Flow Hijacked keeps these levels connected without pretending they are interchangeable.',
    he: 'תרופה או פעימת גירוי יכולות לפעול במהירות, בעוד שהסתגלות קולטנים, למידה, שינה, קשרים והתנהגות חוזרת נפרשות על פני טווחי זמן שונים. Flow Hijacked מחבר בין הרמות האלה בלי להעמיד פנים שהן ניתנות להחלפה זו בזו.',
  },
} as const;

export default function NeuromodulationScreen() {
  const { locale } = useLocale();
  const [selectedId, setSelectedId] = useState<NeuromodulatorEntry['id']>('dopamine');
  const selected = neuromodulators.find((entry) => entry.id === selectedId) ?? neuromodulators[0];
  if (!selected) return null;

  return (
    <ReadingShell
      destination={destination}
      eyebrow={copy.eyebrow[locale]}
      questionPrompt={locale === 'he' ? `הסבר כיצד ${selected.name.he} פועל במסלולים שונים ולמה אי אפשר לצמצם אותו לחומר רגשי אחד.` : `Explain how ${selected.name.en} acts across different pathways and why it cannot be reduced to one emotional chemical.`}
    >
      <View style={styles.selectorSection}>
        <FlowText variant='sectionTitle' accessibilityRole='header'>{copy.select[locale]}</FlowText>
        <FlowText tone='secondary'>{copy.selectLead[locale]}</FlowText>
        <View accessibilityRole='radiogroup' style={styles.selector}>
          {neuromodulators.map((entry) => {
            const active = entry.id === selected.id;
            return (
              <Pressable
                key={entry.id}
                accessibilityRole='radio'
                accessibilityState={{ selected: active }}
                onPress={() => setSelectedId(entry.id)}
                style={({ pressed }) => [styles.selectorButton, active && styles.selectorActive, pressed && styles.pressed]}
              >
                <FlowText variant='bodySmall' tone={active ? 'ink' : 'secondary'} style={styles.selectorLabel}>{localize(entry.name, locale)}</FlowText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <PathwayMap entry={selected} />

      <View style={styles.explanationSection}>
        <Eyebrow>{copy.role[locale]}</Eyebrow>
        <FlowText serif style={styles.body}>{localize(selected.role, locale)}</FlowText>
      </View>

      <View style={styles.explanationSection}>
        <Eyebrow>{copy.lens[locale]}</Eyebrow>
        <FlowText serif style={styles.body}>{localize(selected.recoveryLens, locale)}</FlowText>
      </View>

      <View style={styles.boundary}>
        <Eyebrow tone='gold'>{copy.boundary[locale]}</Eyebrow>
        <FlowText tone='secondary'>{localize(selected.boundary, locale)}</FlowText>
      </View>

      <View style={styles.longSection}>
        <FlowText variant='sectionTitle' serif accessibilityRole='header'>{copy.beyondTitle[locale]}</FlowText>
        <FlowText serif style={styles.body}>{copy.beyondBody[locale]}</FlowText>
      </View>

      <View style={styles.longSection}>
        <FlowText variant='sectionTitle' serif accessibilityRole='header'>{copy.recoveryTitle[locale]}</FlowText>
        <FlowText serif style={styles.body}>{copy.recoveryBody[locale]}</FlowText>
      </View>
    </ReadingShell>
  );
}

function PathwayMap({ entry }: { entry: NeuromodulatorEntry }) {
  const { locale } = useLocale();
  return (
    <View style={styles.pathway} accessibilityLabel={`${copy.origin[locale]}: ${localize(entry.origin, locale)}. ${copy.pathway[locale]}: ${entry.destinations.map((value) => localize(value, locale)).join(', ')}`}>
      <Eyebrow>{copy.pathway[locale]}</Eyebrow>
      <View style={styles.originNode}>
        <FlowText variant='metadata' tone='teal'>{copy.origin[locale]}</FlowText>
        <FlowText style={styles.nodeTitle}>{localize(entry.origin, locale)}</FlowText>
      </View>
      <View style={styles.stem} accessibilityElementsHidden />
      <View style={styles.destinations}>
        {entry.destinations.map((destinationValue, index) => (
          <View key={`${entry.id}-destination-${index}`} style={styles.destinationRow}>
            <View style={styles.destinationNode} accessibilityElementsHidden />
            <FlowText style={styles.destinationText}>{localize(destinationValue, locale)}</FlowText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorSection: { gap: spacing.md },
  selector: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  selectorButton: {
    minHeight: touch.minimum,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorActive: { backgroundColor: colors.paper, borderColor: colors.paper },
  selectorLabel: { fontWeight: '600' },
  pathway: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    gap: spacing.md,
  },
  originNode: {
    padding: spacing.md,
    borderStartWidth: 2,
    borderStartColor: colors.tealSoft,
    backgroundColor: colors.surfaceRaised,
    gap: spacing.xs,
  },
  nodeTitle: { fontWeight: '600' },
  stem: { width: 1, height: 24, backgroundColor: colors.teal, marginStart: spacing.xl },
  destinations: { gap: spacing.sm },
  destinationRow: { minHeight: touch.minimum, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  destinationNode: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.blue },
  destinationText: { flex: 1 },
  explanationSection: { gap: spacing.md },
  body: { fontSize: 18, lineHeight: 30 },
  boundary: { paddingStart: spacing.lg, paddingVertical: spacing.md, borderStartWidth: 2, borderStartColor: colors.gold, gap: spacing.xs },
  longSection: { gap: spacing.md },
  pressed: { opacity: 0.72 },
});
