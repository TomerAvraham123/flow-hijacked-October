import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { destinationHref } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { useContinuityStore } from '@/state/continuityStore';
import { colors, spacing, touch } from '@/theme/tokens';
import type { SavedItem } from '@/types/content';
import { localize } from '@/utils/bilingual';

const copy = {
  title: { en: 'Saved / Continue Reading', he: 'שמורים / המשך קריאה' },
  lead: {
    en: 'A small continuity space for ideas you chose—not a feed and not a list of obligations.',
    he: 'מרחב קטן לרצף של רעיונות שבחרתם — לא פיד ולא רשימת חובות.',
  },
  continue: { en: 'Continue reading', he: 'להמשיך לקרוא' },
  saved: { en: 'Saved for later', he: 'נשמרו להמשך' },
  askAnswers: { en: 'Saved Ask answers', he: 'תשובות Ask שמורות' },
  remove: { en: 'Remove', he: 'להסיר' },
  resumed: { en: 'read', he: 'נקרא' },
  openAnswer: { en: 'Continue this question in Ask', he: 'להמשיך את השאלה ב־Ask' },
} as const;

export default function SavedScreen() {
  useSensitiveScreenProtection('saved');
  const { locale } = useLocale();
  const saved = useContinuityStore((state) => state.saved);
  const recent = useContinuityStore((state) => state.recent);
  const remove = useContinuityStore((state) => state.remove);
  const savedAnswers = useAskStore((state) => state.savedAnswers);
  const openSavedAnswer = useAskStore((state) => state.openSavedAnswer);
  const continuing = recent.filter((item) => (item.progress ?? 0) > 0.01 && (item.progress ?? 0) < 0.96).slice(0, 8);
  const isEmpty = saved.length === 0 && continuing.length === 0 && savedAnswers.length === 0;

  return (
    <Screen>
      <View style={styles.hero}>
        <Eyebrow tone='gold'>{tr('readingQueue', locale)}</Eyebrow>
        <FlowText variant='display' serif accessibilityRole='header'>{copy.title[locale]}</FlowText>
        <FlowText variant='subheading' tone='secondary' serif>{copy.lead[locale]}</FlowText>
        <FlowText variant='bodySmall' tone='muted'>{tr('nothingOwed', locale)}</FlowText>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <FlowText variant='sectionTitle' serif>{tr('noSaved', locale)}</FlowText>
          <Pressable accessibilityRole='button' onPress={() => router.replace('/(tabs)/explore' as Href)} style={styles.exploreButton}>
            <FlowText style={styles.exploreLabel}>{tr('explore', locale)}</FlowText>
          </Pressable>
        </View>
      ) : null}

      {continuing.length > 0 ? (
        <Section>
          <FlowText variant='sectionTitle' accessibilityRole='header'>{copy.continue[locale]}</FlowText>
          <View style={styles.list}>
            {continuing.map((item) => <SavedRow key={`continue-${item.id}`} item={item} />)}
          </View>
        </Section>
      ) : null}

      {saved.length > 0 ? (
        <Section>
          <FlowText variant='sectionTitle' accessibilityRole='header'>{copy.saved[locale]}</FlowText>
          <View style={styles.list}>
            {saved.map((item) => <SavedRow key={`saved-${item.id}`} item={item} onRemove={() => remove(item.id)} />)}
          </View>
        </Section>
      ) : null}

      {savedAnswers.length > 0 ? (
        <Section>
          <FlowText variant='sectionTitle' accessibilityRole='header'>{copy.askAnswers[locale]}</FlowText>
          <View style={styles.list}>
            {savedAnswers.map((answer) => (
              <Pressable
                key={`${answer.topic}-${answer.question}`}
                accessibilityRole='button'
                onPress={() => {
                  openSavedAnswer(answer);
                  router.push('/ask/answer' as Href);
                }}
                style={({ pressed }) => [styles.askRow, pressed && styles.pressed]}
              >
                <Eyebrow>{answer.topic}</Eyebrow>
                <FlowText variant='subheading' serif>{answer.question}</FlowText>
                <FlowText variant='bodySmall' tone='teal'>{copy.openAnswer[locale]} ↗</FlowText>
              </Pressable>
            ))}
          </View>
        </Section>
      ) : null}
    </Screen>
  );
}

function SavedRow({ item, onRemove }: { item: SavedItem; onRemove?: () => void }) {
  const { locale, rtl } = useLocale();
  const percent = Math.round((item.progress ?? 0) * 100);
  const open = () => router.push(destinationHref(item) as Href);
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole='button' onPress={open} style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]}>
        <View style={styles.rowCopy}>
          <Eyebrow>{item.kind.replaceAll('_', ' ')}</Eyebrow>
          <FlowText variant='subheading' serif>{localize(item.title, locale)}</FlowText>
          <FlowText variant='bodySmall' tone='secondary'>{localize(item.subtitle, locale)}</FlowText>
          {percent > 1 ? (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%`, alignSelf: rtl ? 'flex-end' : 'flex-start' }]} />
            </View>
          ) : null}
          {percent > 1 ? <FlowText variant='metadata' tone='muted'>{percent}% {copy.resumed[locale]}</FlowText> : null}
        </View>
        <FlowText tone='teal' accessibilityElementsHidden>{rtl ? '←' : '→'}</FlowText>
      </Pressable>
      {onRemove ? (
        <Pressable accessibilityRole='button' accessibilityLabel={`${copy.remove[locale]} ${localize(item.title, locale)}`} onPress={onRemove} style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
          <FlowText variant='bodySmall' tone='muted'>{copy.remove[locale]}</FlowText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: spacing.xxxl, gap: spacing.md },
  empty: { marginTop: spacing.hero, paddingVertical: spacing.xxl, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, gap: spacing.xl },
  exploreButton: {
    minHeight: touch.primaryHeight,
    paddingHorizontal: spacing.xl,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  exploreLabel: { color: colors.ink, fontWeight: '600' },
  list: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.line },
  row: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowMain: { minHeight: 126, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowCopy: { flex: 1, gap: spacing.xs },
  progressTrack: { height: 2, backgroundColor: colors.line, marginTop: spacing.xs },
  progressFill: { height: 2, backgroundColor: colors.tealSoft },
  remove: { minHeight: touch.minimum, alignSelf: 'flex-end', justifyContent: 'center', paddingHorizontal: spacing.sm },
  askRow: { minHeight: 126, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line, gap: spacing.xs },
  pressed: { opacity: 0.72 },
});
