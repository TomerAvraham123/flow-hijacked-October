import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { destinationHref } from '@/content/explore';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { useContinuityStore } from '@/state/continuityStore';
import { useRecoveryStore } from '@/state/recoveryStore';
import { spacing } from '@/theme/tokens';
import { localize } from '@/utils/bilingual';

export default function ContinueScreen() {
  useSensitiveScreenProtection('continue');
  const { locale } = useLocale();
  const recent = useContinuityStore((state) => state.recent);
  const answer = useAskStore((state) => state.currentAnswer);
  const latestField = useRecoveryStore((state) => state.checkIns[0]);

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'רצף · בלי חוב' : 'CONTINUITY · WITHOUT DEBT'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('continueWhere', locale)}</FlowText>
        <FlowText tone="secondary">{tr('nothingOwed', locale)}</FlowText>
      </Section>

      <Section style={styles.list}>
        {latestField ? (
          <Action label={tr('recoveryField', locale)} detail={locale === 'he' ? 'הרגע האחרון שתיארתם' : 'The last moment you described'} variant="secondary" onPress={() => router.push('/(tabs)/field')} />
        ) : null}
        {answer ? <Action label={answer.question} detail="Ask Flow Hijacked" variant="quiet" onPress={() => router.push('/ask/answer')} /> : null}
        {recent.map((item) => (
          <Action
            key={item.id}
            label={localize(item.title, locale)}
            detail={`${localize(item.subtitle, locale)}${item.progress ? ` · ${Math.round(item.progress * 100)}%` : ''}`}
            variant="quiet"
            onPress={() => router.push(destinationHref(item) as Href)}
          />
        ))}
        {!latestField && !answer && !recent.length ? <FlowText tone="muted">{tr('noSaved', locale)}</FlowText> : null}
      </Section>

      <View style={styles.close}>
        <Action label={tr('close', locale)} variant="quiet" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  list: { gap: spacing.sm },
  close: { marginTop: spacing.hero },
});
