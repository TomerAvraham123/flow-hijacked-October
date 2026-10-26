import { type Href, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ReadingShell } from '@/components/ReadingShell';
import { Screen } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { therapyDocuments } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { colors, spacing, touch } from '@/theme/tokens';
import { localize } from '@/utils/bilingual';

const copy = {
  fit: { en: 'A route, not a verdict', he: 'מסלול אפשרי, לא פסק דין' },
  fitBody: {
    en: 'A therapy name does not determine fit by itself. Goals, safety, diagnosis, therapist competence, relationship, access and personal preference all matter.',
    he: 'שם של שיטת טיפול אינו קובע לבדו אם היא מתאימה. מטרות, בטיחות, אבחנה, הכשרת המטפל, הקשר הטיפולי, נגישות והעדפות אישיות — כולם חשובים.',
  },
  other: { en: 'Look through another therapy lens', he: 'להביט דרך עדשה טיפולית נוספת' },
  compare: { en: 'Compare in Ask', he: 'להשוות ב־Ask' },
  unavailable: { en: 'This therapy route is not available in the native library yet.', he: 'מסלול הטיפול הזה עדיין אינו זמין בספרייה הנייטיבית.' },
  returnExplore: { en: 'Return to Explore', he: 'חזרה לאזור החקירה' },
  sourceNote: { en: 'Evidence note', he: 'הערת ראיות' },
} as const;

export default function TherapyRouteScreen() {
  const { slug: routeSlug } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
  const document = slug ? therapyDocuments[slug] : undefined;
  const { locale, rtl } = useLocale();

  if (!document) {
    return (
      <Screen contentStyle={styles.missing}>
        <Eyebrow>{locale === 'he' ? 'מסלולי טיפול' : 'Therapy Routes'}</Eyebrow>
        <FlowText variant='sectionTitle' accessibilityRole='header'>{copy.unavailable[locale]}</FlowText>
        <Pressable accessibilityRole='button' onPress={() => router.replace('/(tabs)/explore' as Href)} style={styles.returnButton}>
          <FlowText style={styles.returnLabel}>{copy.returnExplore[locale]}</FlowText>
        </Pressable>
      </Screen>
    );
  }

  const title = localize(document.title, locale);
  const comparisonTarget = Object.values(therapyDocuments).find((candidate) => candidate.id !== document.id);
  const comparisonTitle = comparisonTarget ? localize(comparisonTarget.title, locale) : '';
  const askPrompt = locale === 'he'
    ? `השווה בין ${title} לבין ${comparisonTitle}. למי כל גישה עשויה להתאים, מה היא מנסה לשנות ומה מגבלות הראיות?`
    : `Compare ${title} with ${comparisonTitle}. Who might each approach fit, what does it try to change, and what are the evidence limits?`;

  return (
    <ReadingShell destination={document} eyebrow={localize(document.eyebrow, locale)} questionPrompt={askPrompt}>
      <View style={styles.fitBoundary}>
        <Eyebrow tone='gold'>{copy.fit[locale]}</Eyebrow>
        <FlowText tone='secondary'>{copy.fitBody[locale]}</FlowText>
      </View>

      {document.sections.map((section, index) => (
        <View key={section.id} style={styles.section}>
          <Eyebrow>{String(index + 1).padStart(2, '0')}</Eyebrow>
          <FlowText variant='sectionTitle' serif accessibilityRole='header'>{localize(section.title, locale)}</FlowText>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <FlowText key={`${section.id}-${paragraphIndex}`} serif style={styles.body}>{localize(paragraph, locale)}</FlowText>
          ))}
        </View>
      ))}

      {document.references.map((reference, index) => (
        <View key={`${document.id}-reference-${index}`} style={styles.reference}>
          <Eyebrow tone='gold'>{copy.sourceNote[locale]}</Eyebrow>
          <FlowText style={styles.referenceTitle}>{localize(reference.title, locale)}</FlowText>
          <FlowText variant='bodySmall' tone='secondary'>{localize(reference.detail, locale)}</FlowText>
        </View>
      ))}

      <View style={styles.otherRoutes}>
        <FlowText variant='sectionTitle' accessibilityRole='header'>{copy.other[locale]}</FlowText>
        <View style={styles.routeList}>
          {Object.values(therapyDocuments).filter((candidate) => candidate.id !== document.id).map((candidate) => (
            <Pressable
              key={candidate.id}
              accessibilityRole='button'
              onPress={() => router.replace(`/therapy/${candidate.slug}` as Href)}
              style={({ pressed }) => [styles.routeRow, pressed && styles.pressed]}
            >
              <View style={styles.routeCopy}>
                <FlowText style={styles.routeTitle}>{localize(candidate.title, locale)}</FlowText>
                <FlowText variant='bodySmall' tone='secondary'>{localize(candidate.subtitle, locale)}</FlowText>
              </View>
              <FlowText tone='teal' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.push(`/(tabs)/ask?q=${encodeURIComponent(askPrompt)}&sourcePath=${encodeURIComponent(document.canonicalPath)}` as Href)}
          style={({ pressed }) => [styles.compare, pressed && styles.pressed]}
        >
          <FlowText style={styles.compareLabel}>{copy.compare[locale]}</FlowText>
          <FlowText tone='teal' accessibilityElementsHidden>↗</FlowText>
        </Pressable>
      </View>
    </ReadingShell>
  );
}

const styles = StyleSheet.create({
  missing: { paddingTop: spacing.hero, gap: spacing.xl },
  returnButton: {
    minHeight: touch.primaryHeight,
    paddingHorizontal: spacing.xl,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  returnLabel: { color: colors.ink, fontWeight: '600' },
  fitBoundary: { paddingStart: spacing.lg, paddingVertical: spacing.md, borderStartWidth: 2, borderStartColor: colors.gold, gap: spacing.xs },
  section: { gap: spacing.md },
  body: { fontSize: 18, lineHeight: 30 },
  reference: { paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.line, gap: spacing.xs },
  referenceTitle: { fontWeight: '600' },
  otherRoutes: { gap: spacing.lg },
  routeList: { borderTopWidth: 1, borderTopColor: colors.line },
  routeRow: {
    minHeight: 94,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  routeCopy: { flex: 1, gap: spacing.xxs },
  routeTitle: { fontWeight: '600' },
  compare: {
    minHeight: touch.primaryHeight,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  compareLabel: { flex: 1, fontWeight: '600' },
  pressed: { opacity: 0.72 },
});
