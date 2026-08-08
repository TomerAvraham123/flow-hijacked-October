import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { ChoiceGroup } from '@/components/ChoiceGroup';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { buildRoutes, deriveSnapshot } from '@/model/recoveryField';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, radii, spacing } from '@/theme/tokens';
import type { ActionFeedback } from '@/types/recovery';
import { localize } from '@/utils/bilingual';

export default function ActionScreen() {
  useSensitiveScreenProtection('field-action');
  const { locale } = useLocale();
  const { checkInId, routeId } = useLocalSearchParams<{ checkInId: string; routeId: string }>();
  const checkIns = useRecoveryStore((state) => state.checkIns);
  const addFeedback = useRecoveryStore((state) => state.addFeedback);
  const checkIn = checkIns.find((entry) => entry.id === checkInId) ?? checkIns[0];
  const previous = checkIns.find((entry) => entry.createdAt < (checkIn?.createdAt ?? ''));
  const route = useMemo(() => {
    if (!checkIn) return undefined;
    return buildRoutes(deriveSnapshot(checkIn, previous), checkIn.capacityMode === 'quiet').find((entry) => entry.id === routeId);
  }, [checkIn, previous, routeId]);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [feasibility, setFeasibility] = useState<ActionFeedback['feasibility']>();
  const [outcome, setOutcome] = useState<ActionFeedback['outcome']>();
  const [saved, setSaved] = useState(false);

  if (!checkIn || !route) {
    return <Screen><Wordmark /><Section><FlowText>{locale === 'he' ? 'המסלול הזה כבר אינו זמין.' : 'This route is no longer available.'}</FlowText></Section></Screen>;
  }

  async function shareRoute() {
    const lines = route!.steps.map((step, index) => `${index + 1}. ${localize(step.title, locale)} — ${localize(step.instruction, locale)}`);
    await Share.share({ message: `${localize(route!.title, locale)}\n\n${lines.join('\n\n')}\n\nFlow Hijacked` });
  }

  function saveFeedback() {
    if (!startedAt || !feasibility || !outcome) return;
    addFeedback({ checkInId: checkIn!.id, routeId: route!.id, startedAt, completedAt: new Date().toISOString(), feasibility, outcome });
    setSaved(true);
  }

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{route.isBestNextStep ? tr('mostAccessible', locale) : locale === 'he' ? 'המסלול שנבחר' : 'SELECTED ROUTE'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{localize(route.title, locale)}</FlowText>
        <FlowText tone="secondary">{localize(route.subtitle, locale)}</FlowText>
        <FlowText>{localize(route.rationale, locale)}</FlowText>
      </Section>

      <Section style={styles.steps}>
        {route.steps.map((step, index) => (
          <View key={step.id} style={styles.step}>
            <FlowText variant="metadata" tone="teal">{String(index + 1).padStart(2, '0')}</FlowText>
            <View style={styles.stepCopy}>
              <FlowText variant="subheading">{localize(step.title, locale)}</FlowText>
              <FlowText>{localize(step.instruction, locale)}</FlowText>
              <FlowText variant="bodySmall" tone="muted">{localize(step.why, locale)}</FlowText>
            </View>
          </View>
        ))}
      </Section>

      {!startedAt ? (
        <Section style={styles.actions}>
          <Action label={tr('startNow', locale)} onPress={() => setStartedAt(new Date().toISOString())} />
          <Action label={locale === 'he' ? 'לשתף רק את הצעדים' : 'Share only the steps'} variant="quiet" onPress={() => void shareRoute()} />
        </Section>
      ) : !saved ? (
        <Section style={styles.feedback}>
          <Eyebrow>{locale === 'he' ? 'חזרה למסלול · אין תשובה מועדפת' : 'RETURN LOOP · NO PREFERRED ANSWER'}</Eyebrow>
          <FlowText variant="sectionTitle">{locale === 'he' ? 'מה היה אפשרי — ומה קרה אחר כך?' : 'What was feasible—and what happened next?'}</FlowText>
          <FlowText tone="secondary">{locale === 'he' ? '״לא היה אפשרי״ ו״גרוע יותר״ הם מידע שימושי, לא כישלון.' : '“Not possible” and “worse” are useful information, not failure.'}</FlowText>
          <ChoiceGroup
            label={locale === 'he' ? 'האם היה אפשר לבצע?' : 'Could you do it?'}
            options={locale === 'he' ? [
              { value: 'not_possible', label: 'לא היה אפשרי' }, { value: 'hard', label: 'חלקית / בקושי' }, { value: 'possible', label: 'כן, היה אפשרי' },
            ] : [
              { value: 'not_possible', label: 'Not possible' }, { value: 'hard', label: 'Partly / with effort' }, { value: 'possible', label: 'Yes, feasible' },
            ]}
            value={feasibility}
            onChange={setFeasibility}
          />
          <ChoiceGroup
            label={locale === 'he' ? 'מה השתנה אחר כך?' : 'What changed afterward?'}
            options={locale === 'he' ? [
              { value: 'worse', label: 'גרוע יותר' }, { value: 'same', label: 'ללא שינוי' }, { value: 'little', label: 'מעט עזר' }, { value: 'clear', label: 'עזר בבירור' },
            ] : [
              { value: 'worse', label: 'Worse' }, { value: 'same', label: 'No change' }, { value: 'little', label: 'Helped a little' }, { value: 'clear', label: 'Clearly helped' },
            ]}
            value={outcome}
            onChange={setOutcome}
          />
          <Action label={locale === 'he' ? 'לשמור את המשוב' : 'Save this feedback'} disabled={!feasibility || !outcome} onPress={saveFeedback} />
        </Section>
      ) : (
        <Section style={styles.saved}>
          <FlowText variant="sectionTitle">{locale === 'he' ? 'המשוב נשמר כמידע, לא כציון.' : 'Feedback saved as information—not a score.'}</FlowText>
          <Action label={tr('close', locale)} onPress={() => router.replace('/(tabs)/field')} />
        </Section>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  steps: { gap: spacing.xl },
  step: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radii.sheet, backgroundColor: colors.surface },
  stepCopy: { flex: 1, gap: spacing.sm },
  actions: { gap: spacing.sm },
  feedback: { gap: spacing.lg },
  saved: { gap: spacing.lg },
});
