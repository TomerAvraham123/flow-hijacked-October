import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { ChoiceGroup } from '@/components/ChoiceGroup';
import { Screen, Section } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { ToggleRow } from '@/components/ToggleRow';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { dimensionIds, dimensionLabels, signalLabels } from '@/model/recoveryField';
import { defaultDimensions, pressureSignals, useRecoveryStore } from '@/state/recoveryStore';
import { colors, spacing } from '@/theme/tokens';
import type { ChangeSignal, FieldDimensionId, FieldDimensions, SmallestReturn } from '@/types/recovery';

const availability = {
  en: [
    { value: 2, label: 'Very constrained' },
    { value: 4, label: 'Limited' },
    { value: 6, label: 'Available' },
    { value: 8, label: 'Spacious' },
  ],
  he: [
    { value: 2, label: 'מצומצם מאוד' },
    { value: 4, label: 'מוגבל' },
    { value: 6, label: 'זמין' },
    { value: 8, label: 'מרווח' },
  ],
};

const quietDimensions: FieldDimensionId[] = ['body', 'control', 'relationships'];

export default function CheckInScreen() {
  useSensitiveScreenProtection('field-check-in');
  const { locale } = useLocale();
  const params = useLocalSearchParams<{ return?: SmallestReturn }>();
  const latest = useRecoveryStore((state) => state.checkIns[0]);
  const save = useRecoveryStore((state) => state.saveCheckIn);
  const [quiet, setQuiet] = useState(false);
  const [dimensions, setDimensions] = useState<FieldDimensions>(latest?.dimensions ?? defaultDimensions);
  const [signals, setSignals] = useState<ChangeSignal[]>([]);
  const visibleDimensions = quiet ? quietDimensions : dimensionIds;
  const smallestReturn = params.return ?? 'unsure';

  const signalOptions = useMemo(
    () => pressureSignals.map((signal) => ({ value: signal, label: signalLabels[signal][locale] })),
    [locale],
  );

  function changeSignal(signal: ChangeSignal) {
    setSignals((current) => (current.includes(signal) ? current.filter((item) => item !== signal) : [...current, signal]));
  }

  function submit() {
    const checkIn = save({
      smallestReturn,
      dimensions,
      observedDimensions: visibleDimensions,
      signals,
      capacityMode: quiet ? 'quiet' : 'standard',
    });
    router.replace({ pathname: '/field/routes', params: { checkInId: checkIn.id } });
  }

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'עדכון שדה · סובייקטיבי · פרטי' : 'FIELD CHECK-IN · SUBJECTIVE · PRIVATE'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('checkIn', locale)}</FlowText>
        <FlowText tone="secondary">{tr('checkInLead', locale)}</FlowText>
      </Section>

      <Section>
        <ToggleRow label={tr('lowCapacity', locale)} detail={tr('lowCapacityHint', locale)} value={quiet} onValueChange={setQuiet} />
      </Section>

      <Section style={styles.dimensionStack}>
        <SectionHeader
          index="01"
          title={locale === 'he' ? 'מה מרגיש זמין כרגע?' : 'What feels available right now?'}
          body={locale === 'he' ? 'אין תשובה נכונה. בחרו את התיאור הקרוב ביותר.' : 'There is no correct answer. Choose the closest description.'}
        />
        {visibleDimensions.map((dimension) => (
          <View key={dimension} style={styles.dimension}>
            <FlowText style={styles.dimensionTitle}>{dimensionLabels[dimension][locale]}</FlowText>
            <ChoiceGroup
              label={dimensionLabels[dimension][locale]}
              options={availability[locale]}
              value={dimensions[dimension]}
              onChange={(value) => setDimensions((current) => ({ ...current, [dimension]: value }))}
            />
          </View>
        ))}
      </Section>

      <Section style={styles.pressureSection}>
        <SectionHeader index="02" title={tr('currentPressure', locale)} body={locale === 'he' ? 'אפשר לבחור יותר מאחד, או לא לבחור כלל.' : 'Choose more than one, or none at all.'} />
        <ChoiceGroup label={tr('currentPressure', locale)} options={signalOptions} value={signals} onChange={changeSignal} multiple />
      </Section>

      <Section style={styles.submit}>
        <Action label={tr('buildField', locale)} onPress={submit} />
        <FlowText variant="bodySmall" tone="muted">
          {locale === 'he'
            ? 'הרשומה נשמרת במאגר החלמה מוצפן ונפרד במכשיר. היא אינה מועברת ל־Ask בלי בחירה מפורשת.'
            : 'This entry stays in a separate encrypted Recovery store on your device. It is not passed to Ask without explicit permission.'}
        </FlowText>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  dimensionStack: { gap: spacing.xl },
  dimension: { gap: spacing.sm, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  dimensionTitle: { fontWeight: '600' },
  pressureSection: { gap: spacing.lg },
  submit: { gap: spacing.md },
});
