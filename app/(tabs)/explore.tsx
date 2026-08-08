import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { destinationHref, exploreEntries, lectureDocuments, type ExploreEntry } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { useContinuityStore } from '@/state/continuityStore';
import { colors, radii, spacing, touch } from '@/theme/tokens';
import type { ContentDestination, SavedItem } from '@/types/content';
import { localize } from '@/utils/bilingual';

const copy = {
  hereNowLead: { en: 'A five-minute reflection and one practical movement for today.', he: 'קריאה של חמש דקות ותנועה מעשית אחת להיום.' },
  featured: { en: 'Good places to begin', he: 'מקומות טובים להתחיל מהם' },
  featuredLead: { en: 'Three different entrances into the larger framework.', he: 'שלוש כניסות שונות אל המסגרת הרחבה יותר.' },
  depthMap: { en: 'The depth map', he: 'מפת העומק' },
  depthLead: { en: 'Complexity appears progressively. Choose the question, not a menu hierarchy.', he: 'המורכבות נפתחת בהדרגה. בחרו את השאלה שמושכת אתכם, לא היררכיה של תפריטים.' },
  resume: { en: 'Resume', he: 'להמשיך' },
  complete: { en: 'read', he: 'נקרא' },
  queue: { en: 'Open saved reading', he: 'לפתוח את הקריאה השמורה' },
} as const;

export default function ExploreScreen() {
  const { locale, rtl } = useLocale();
  const recent = useContinuityStore((state) => state.recent);
  const saved = useContinuityStore((state) => state.saved);
  const continuation = recent.find((item) => (item.progress ?? 0) < 0.96) ?? recent[0];

  const open = (href: string) => router.push(href as Href);

  return (
    <Screen>
      <View style={styles.hero}>
        <Eyebrow>{tr('explore', locale)}</Eyebrow>
        <FlowText variant='display' serif accessibilityRole='header'>{tr('exploreTitle', locale)}</FlowText>
        <FlowText variant='subheading' tone='secondary' serif>{tr('exploreLead', locale)}</FlowText>
      </View>

      <Pressable
        accessibilityRole='button'
        onPress={() => open('/here-now')}
        style={({ pressed }) => [styles.hereNow, pressed && styles.pressed]}
      >
        <View style={styles.linkCopy}>
          <Eyebrow tone='gold'>{tr('hereNow', locale)}</Eyebrow>
          <FlowText variant='sectionTitle' serif>{tr('oneUsefulThing', locale)}</FlowText>
          <FlowText tone='secondary'>{localize(copy.hereNowLead, locale)}</FlowText>
        </View>
        <FlowText variant='sectionTitle' tone='gold' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
      </Pressable>

      {continuation ? (
        <Section>
          <View style={styles.sectionHeading}>
            <Eyebrow>{tr('continueWhere', locale)}</Eyebrow>
            <FlowText tone='muted'>{tr('nothingOwed', locale)}</FlowText>
          </View>
          <ContinuationRow item={continuation} onPress={() => open(destinationHref(continuation))} />
        </Section>
      ) : null}

      <Section>
        <View style={styles.sectionHeading}>
          <FlowText variant='sectionTitle' accessibilityRole='header'>{localize(copy.depthMap, locale)}</FlowText>
          <FlowText tone='secondary'>{localize(copy.depthLead, locale)}</FlowText>
        </View>
        <View style={styles.editorialList}>
          {exploreEntries.map((entry, index) => (
            <ExploreRow key={entry.id} entry={entry} index={index + 1} onPress={() => open(entry.href)} />
          ))}
        </View>
      </Section>

      <Section>
        <View style={styles.sectionHeading}>
          <FlowText variant='sectionTitle' accessibilityRole='header'>{localize(copy.featured, locale)}</FlowText>
          <FlowText tone='secondary'>{localize(copy.featuredLead, locale)}</FlowText>
        </View>
        <View style={styles.editorialList}>
          {lectureDocuments.map((document) => (
            <Pressable
              key={document.id}
              accessibilityRole='button'
              onPress={() => open(`/reading/${document.slug}`)}
              style={({ pressed }) => [styles.readingRow, pressed && styles.pressed]}
            >
              <View style={styles.linkCopy}>
                <FlowText variant='metadata' tone='muted'>{document.readingMinutes} min</FlowText>
                <FlowText variant='subheading' serif>{localize(document.title, locale)}</FlowText>
                <FlowText variant='bodySmall' tone='secondary'>{localize(document.subtitle, locale)}</FlowText>
              </View>
              <FlowText tone='teal' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section>
        <Pressable
          accessibilityRole='button'
          onPress={() => open('/saved')}
          style={({ pressed }) => [styles.queue, pressed && styles.pressed]}
        >
          <View style={styles.linkCopy}>
            <Eyebrow tone='gold'>{tr('readingQueue', locale)}</Eyebrow>
            <FlowText variant='subheading'>{localize(copy.queue, locale)}</FlowText>
            <FlowText variant='bodySmall' tone='muted'>
              {saved.length} {locale === 'he' ? 'פריטים שמורים' : saved.length === 1 ? 'saved item' : 'saved items'}
            </FlowText>
          </View>
          <FlowText tone='gold' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
        </Pressable>
      </Section>
    </Screen>
  );
}

function ExploreRow({ entry, index, onPress }: { entry: ExploreEntry; index: number; onPress: () => void }) {
  const { locale, rtl } = useLocale();
  return (
    <Pressable accessibilityRole='button' onPress={onPress} style={({ pressed }) => [styles.exploreRow, pressed && styles.pressed]}>
      <FlowText variant='metadata' tone='muted' style={styles.index}>{String(index).padStart(2, '0')}</FlowText>
      <View style={styles.linkCopy}>
        <Eyebrow>{localize(entry.eyebrow, locale)}</Eyebrow>
        <FlowText variant='subheading' serif>{localize(entry.title, locale)}</FlowText>
        <FlowText variant='bodySmall' tone='secondary'>{localize(entry.subtitle, locale)}</FlowText>
      </View>
      <FlowText tone='teal' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
    </Pressable>
  );
}

function ContinuationRow({ item, onPress }: { item: SavedItem & ContentDestination; onPress: () => void }) {
  const { locale, rtl } = useLocale();
  const percent = Math.round((item.progress ?? 0) * 100);
  return (
    <Pressable accessibilityRole='button' onPress={onPress} style={({ pressed }) => [styles.continuation, pressed && styles.pressed]}>
      <View style={styles.linkCopy}>
        <Eyebrow tone='gold'>{localize(copy.resume, locale)}</Eyebrow>
        <FlowText variant='subheading' serif>{localize(item.title, locale)}</FlowText>
        <FlowText variant='bodySmall' tone='secondary'>{localize(item.subtitle, locale)}</FlowText>
        {percent > 1 ? (
          <View style={styles.resumeProgress}>
            <View style={[styles.resumeFill, { width: `${percent}%`, alignSelf: rtl ? 'flex-end' : 'flex-start' }]} />
          </View>
        ) : null}
        {percent > 1 ? <FlowText variant='metadata' tone='muted'>{percent}% {localize(copy.complete, locale)}</FlowText> : null}
      </View>
      <FlowText tone='gold' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: spacing.xxxl, gap: spacing.md },
  hereNow: {
    marginTop: spacing.xxxl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.action,
    backgroundColor: colors.warmSurface,
    borderWidth: 1,
    borderColor: 'rgba(212,180,138,0.35)',
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionHeading: { gap: spacing.sm, marginBottom: spacing.lg },
  editorialList: { borderTopWidth: 1, borderTopColor: colors.line },
  exploreRow: {
    minHeight: 132,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  index: { width: 28, paddingTop: spacing.xxs },
  linkCopy: { flex: 1, gap: spacing.xs },
  readingRow: {
    minHeight: 112,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  continuation: {
    minHeight: 148,
    padding: spacing.lg,
    borderStartWidth: 2,
    borderStartColor: colors.gold,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resumeProgress: { height: 2, backgroundColor: colors.line, marginTop: spacing.xs },
  resumeFill: { height: 2, backgroundColor: colors.goldSoft },
  queue: {
    minHeight: touch.primaryHeight,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: { opacity: 0.72 },
});
