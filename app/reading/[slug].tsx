import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { HybridContent } from '@/components/HybridContent';
import { ReadingShell } from '@/components/ReadingShell';
import { Screen } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { readingDocuments } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { colors, spacing, touch } from '@/theme/tokens';
import type { ContentDestination } from '@/types/content';
import { localize } from '@/utils/bilingual';

const copy = {
  map: { en: 'In this reading', he: 'בקריאה הזאת' },
  note: { en: 'Interpretive boundary', he: 'גבול הפרשנות' },
  references: { en: 'Sources and foundations', he: 'מקורות ויסודות' },
  showReferences: { en: 'Show source notes', he: 'להציג הערות מקור' },
  hideReferences: { en: 'Hide source notes', he: 'להסתיר הערות מקור' },
  missing: { en: 'This reading is not available in the native library yet.', he: 'הקריאה הזאת עדיין אינה זמינה בספרייה הנייטיבית.' },
  returnExplore: { en: 'Return to Explore', he: 'חזרה לאזור החקירה' },
} as const;

export default function ReadingScreen() {
  const { slug: routeSlug, href: routeHref, title: routeTitle } = useLocalSearchParams<{
    slug?: string | string[];
    href?: string | string[];
    title?: string | string[];
  }>();
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
  const href = Array.isArray(routeHref) ? routeHref[0] : routeHref;
  const fallbackTitle = Array.isArray(routeTitle) ? routeTitle[0] : routeTitle;
  const document = slug ? readingDocuments[slug] : undefined;
  const { locale } = useLocale();

  if (!document) {
    if (href?.startsWith('/')) {
      const readableTitle = fallbackTitle ?? slug?.replaceAll('-', ' ') ?? 'Flow Hijacked';
      const fallback: ContentDestination = {
        id: `canonical-${slug ?? href}`,
        kind: 'concept',
        title: { en: readableTitle, he: readableTitle },
        subtitle: {
          en: 'Canonical material inside the Flow Hijacked reading shell',
          he: 'תוכן קנוני בתוך מעטפת הקריאה של Flow Hijacked',
        },
        canonicalPath: href,
      };
      return (
        <ReadingShell destination={fallback} eyebrow='Flow Hijacked · canonical'>
          <HybridContent canonicalPath={href} title={readableTitle} />
        </ReadingShell>
      );
    }
    return (
      <Screen contentStyle={styles.missing}>
        <Eyebrow>Flow Hijacked</Eyebrow>
        <FlowText variant='sectionTitle' accessibilityRole='header'>{localize(copy.missing, locale)}</FlowText>
        <Pressable accessibilityRole='button' onPress={() => router.replace('/(tabs)/explore' as Href)} style={styles.returnButton}>
          <FlowText style={styles.returnLabel}>{localize(copy.returnExplore, locale)}</FlowText>
        </Pressable>
      </Screen>
    );
  }

  const title = localize(document.title, locale);
  const askPrompt = locale === 'he'
    ? `מהו הרעיון החשוב ביותר ב“${title}”, ומה הוא כן ולא מאפשר להסיק?`
    : `What is the most important idea in “${title}”, and what does it and does it not allow us to conclude?`;

  return (
    <ReadingShell destination={document} eyebrow={localize(document.eyebrow, locale)} questionPrompt={askPrompt}>
      <View style={styles.sectionMap}>
        <Eyebrow tone='gold'>{localize(copy.map, locale)}</Eyebrow>
        {document.sections.map((section, index) => (
          <View key={section.id} style={styles.mapRow}>
            <FlowText variant='metadata' tone='muted'>{String(index + 1).padStart(2, '0')}</FlowText>
            <FlowText variant='bodySmall'>{localize(section.title, locale)}</FlowText>
          </View>
        ))}
      </View>

      {document.sections.map((section, index) => (
        <View key={section.id} nativeID={section.id} style={styles.section}>
          <Eyebrow>{String(index + 1).padStart(2, '0')}</Eyebrow>
          <FlowText variant='sectionTitle' serif accessibilityRole='header'>{localize(section.title, locale)}</FlowText>
          <View style={styles.paragraphs}>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <FlowText key={`${section.id}-${paragraphIndex}`} serif style={styles.body}>{localize(paragraph, locale)}</FlowText>
            ))}
          </View>
          {section.note ? (
            <View style={styles.note}>
              <Eyebrow tone='gold'>{localize(copy.note, locale)}</Eyebrow>
              <FlowText tone='secondary'>{localize(section.note, locale)}</FlowText>
            </View>
          ) : null}
        </View>
      ))}

      <References document={document} />
    </ReadingShell>
  );
}

function References({ document }: { document: NonNullable<(typeof readingDocuments)[string]> }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.references}>
      <FlowText variant='sectionTitle' accessibilityRole='header'>{localize(copy.references, locale)}</FlowText>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.disclosure, pressed && styles.pressed]}
      >
        <FlowText style={styles.disclosureLabel}>{localize(open ? copy.hideReferences : copy.showReferences, locale)}</FlowText>
        <FlowText tone='teal' accessibilityElementsHidden>{open ? '−' : '+'}</FlowText>
      </Pressable>
      {open ? (
        <View style={styles.referenceList}>
          {document.references.map((reference, index) => (
            <View key={`${document.id}-reference-${index}`} style={styles.reference}>
              <FlowText style={styles.referenceTitle}>{localize(reference.title, locale)}</FlowText>
              <FlowText variant='bodySmall' tone='secondary'>{localize(reference.detail, locale)}</FlowText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { paddingTop: spacing.hero, gap: spacing.xl },
  returnButton: {
    minHeight: touch.primaryHeight,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    alignSelf: 'flex-start',
  },
  returnLabel: { color: colors.ink, fontWeight: '600' },
  sectionMap: {
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    gap: spacing.sm,
  },
  mapRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'baseline' },
  section: { gap: spacing.md },
  paragraphs: { gap: spacing.lg },
  body: { fontSize: 18, lineHeight: 30 },
  note: {
    marginTop: spacing.sm,
    paddingStart: spacing.lg,
    paddingVertical: spacing.md,
    borderStartWidth: 2,
    borderStartColor: colors.gold,
    gap: spacing.xs,
  },
  references: { gap: spacing.md, paddingTop: spacing.xl, borderTopWidth: 1, borderTopColor: colors.line },
  disclosure: {
    minHeight: touch.minimum,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  disclosureLabel: { fontWeight: '600' },
  referenceList: { gap: spacing.lg },
  reference: { gap: spacing.xs },
  referenceTitle: { fontWeight: '600' },
  pressed: { opacity: 0.72 },
});
