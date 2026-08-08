import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { destinationHref } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { useContinuityStore } from '@/state/continuityStore';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, radii, spacing } from '@/theme/tokens';
import { localize } from '@/utils/bilingual';

export default function NowScreen() {
  const { locale } = useLocale();
  const recent = useContinuityStore((state) => state.recent[0]);
  const currentAnswer = useAskStore((state) => state.currentAnswer);
  const latestCheckIn = useRecoveryStore((state) => state.checkIns[0]);
  const hasReturned = Boolean(recent || currentAnswer || latestCheckIn);

  return (
    <Screen>
      <View style={styles.top}>
        <Wordmark />
        <FlowText
          accessibilityRole="button"
          accessibilityLabel={tr('settings', locale)}
          onPress={() => router.push('/settings')}
          variant="subheading"
          tone="muted"
          style={styles.settings}
        >
          ···
        </FlowText>
      </View>

      <Section style={styles.hero}>
        <Eyebrow>{hasReturned ? (locale === 'he' ? 'ברוכים השבים' : 'WELCOME BACK') : 'RECOVERY COMPANION / NOW'}</Eyebrow>
        <FlowText variant="display" serif accessibilityRole="header">
          {tr('whereNow', locale)}
        </FlowText>
        <FlowText tone="secondary">{tr('whereNowLead', locale)}</FlowText>
      </Section>

      <Section style={styles.primaryActions}>
        <Action
          label={tr('noticeChange', locale)}
          detail={tr('noticeChangeDetail', locale)}
          onPress={() => router.push('/smallest-return')}
        />
        <Action
          label={tr('askSomething', locale)}
          detail={tr('askSomethingDetail', locale)}
          variant="secondary"
          onPress={() => router.push('/(tabs)/ask')}
        />
        <Action
          label={tr('oneUsefulThing', locale)}
          detail={tr('oneUsefulThingDetail', locale)}
          variant="quiet"
          onPress={() => router.push('/here-now')}
        />
      </Section>

      {hasReturned ? (
        <Section>
          <View style={styles.continuationHeading}>
            <View style={styles.pathMark} />
            <View style={styles.continuationCopy}>
              <FlowText variant="subheading" accessibilityRole="header">{tr('continueWhere', locale)}</FlowText>
              <FlowText variant="bodySmall" tone="muted">{tr('nothingOwed', locale)}</FlowText>
            </View>
          </View>
          {currentAnswer ? (
            <Action
              label={currentAnswer.question}
              detail={locale === 'he' ? 'תשובת Ask האחרונה' : 'Your latest Ask answer'}
              variant="quiet"
              onPress={() => router.push('/ask/answer')}
            />
          ) : recent ? (
            <Action
              label={localize(recent.title, locale)}
              detail={`${localize(recent.subtitle, locale)}${recent.progress ? ` · ${Math.round(recent.progress * 100)}%` : ''}`}
              variant="quiet"
              onPress={() => router.push(destinationHref(recent) as Href)}
            />
          ) : (
            <Action
              label={tr('recoveryField', locale)}
              detail={locale === 'he' ? 'להמשיך מן הרגע האחרון שתיארתם' : 'Continue from the last moment you described'}
              variant="quiet"
              onPress={() => router.push('/(tabs)/field')}
            />
          )}
          <FlowText onPress={() => router.push('/continue')} variant="bodySmall" tone="teal" style={styles.openAll}>
            {locale === 'he' ? 'כל המקומות שאפשר להמשיך מהם ←' : 'All places to continue from →'}
          </FlowText>
        </Section>
      ) : null}

      <View style={styles.boundary}>
        <FlowText variant="bodySmall" tone="muted">
          {locale === 'he'
            ? 'כלי חינוכי ורפלקטיבי. אינו אבחון, טיפול רפואי או תחליף לעזרה מקצועית.'
            : 'An educational and reflective tool. Not diagnosis, medical care or a substitute for professional help.'}
        </FlowText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center' },
  settings: { minWidth: 48, minHeight: 48, textAlign: 'center', textAlignVertical: 'center' },
  hero: { gap: spacing.md },
  primaryActions: { gap: spacing.sm },
  continuationHeading: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  pathMark: { width: 3, borderRadius: 2, backgroundColor: colors.gold },
  continuationCopy: { flex: 1, gap: spacing.xs },
  openAll: { minHeight: 48, paddingVertical: spacing.md },
  boundary: { marginTop: spacing.hero, padding: spacing.lg, borderRadius: radii.control, backgroundColor: colors.surface },
});
