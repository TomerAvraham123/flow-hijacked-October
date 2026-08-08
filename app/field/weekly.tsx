import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { buildWeeklyReflection } from '@/model/recoveryField';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, spacing } from '@/theme/tokens';
import { localize } from '@/utils/bilingual';

export default function WeeklyScreen() {
  useSensitiveScreenProtection('field-weekly');
  const { locale } = useLocale();
  const checkIns = useRecoveryStore((state) => state.checkIns);
  const [cutoff] = useState(() => Date.now() - 8 * 24 * 60 * 60 * 1000);
  const reflection = buildWeeklyReflection(checkIns.filter((entry) => Date.parse(entry.createdAt) > cutoff));
  const sections = [
    ['OBSERVATION', locale === 'he' ? 'דפוס אחד שכדאי לשים לב אליו' : 'One pattern worth noticing', reflection.observation],
    ['OBSERVATION', locale === 'he' ? 'דבר אחד שנשאר זמין' : 'One thing that remained available', reflection.availableAnchor],
    ['OBSERVATION', locale === 'he' ? 'שינוי לאורך השבוע' : 'One change across the week', reflection.change],
    ['QUESTION', locale === 'he' ? 'שאלה שכדאי לשאת הלאה' : 'One question worth carrying forward', reflection.question],
    ['EXPERIMENT', locale === 'he' ? 'ניסוי אחד שאפשר לבדוק' : 'One useful experiment', reflection.experiment],
  ] as const;

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'השתקפות שבועית' : 'WEEKLY REFLECTION'} · {reflection.entryCount} {locale === 'he' ? 'רשומות' : 'ENTRIES'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('weekly', locale)}</FlowText>
      </Section>

      <Section style={styles.sections}>
        {sections.map(([kind, title, body], index) => (
          <View key={title} style={styles.sectionRow}>
            <FlowText variant="metadata" tone={kind === 'EXPERIMENT' ? 'gold' : kind === 'QUESTION' ? 'teal' : 'muted'}>
              {String(index + 1).padStart(2, '0')} · {locale === 'he' ? (kind === 'EXPERIMENT' ? 'ניסוי' : kind === 'QUESTION' ? 'שאלה' : 'תצפית') : kind}
            </FlowText>
            <FlowText variant="subheading">{title}</FlowText>
            <FlowText tone="secondary">{localize(body, locale)}</FlowText>
          </View>
        ))}
      </Section>

      <Section style={styles.boundary}>
        <Eyebrow tone="gold">{locale === 'he' ? 'גבולות הראיות' : 'EVIDENCE BOUNDARY'}</Eyebrow>
        <FlowText variant="bodySmall">{localize(reflection.evidenceBoundary, locale)}</FlowText>
      </Section>

      <Section><Action label={tr('close', locale)} variant="quiet" onPress={() => router.back()} /></Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  sections: { gap: 0 },
  sectionRow: { gap: spacing.sm, paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.line },
  boundary: { gap: spacing.sm, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.gold },
});
