import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { RecoveryFieldVisual } from '@/components/RecoveryFieldVisual';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { deriveSnapshot, dimensionLabels } from '@/model/recoveryField';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, spacing } from '@/theme/tokens';

export default function HistoryScreen() {
  useSensitiveScreenProtection('field-history');
  const { locale } = useLocale();
  const checkIns = useRecoveryStore((state) => state.checkIns);
  const snapshots = checkIns.slice(0, 12).map((entry, index) => deriveSnapshot(entry, checkIns[index + 1]));
  const latest = snapshots[0];

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'מעקב לאורך זמן · השוואה אישית בלבד' : 'LONGITUDINAL RECOVERY · WITHIN-PERSON ONLY'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('history', locale)}</FlowText>
        <FlowText tone="secondary">{tr('historyBoundary', locale)}</FlowText>
      </Section>

      {latest ? <Section><RecoveryFieldVisual snapshot={latest} locale={locale} /></Section> : null}

      <Section style={styles.timeline}>
        {snapshots.map((snapshot, index) => {
          const changed = snapshot.dimensions.filter((dimension) => dimension.change !== 'stable' && dimension.change !== 'unknown');
          return (
            <View key={snapshot.id} style={styles.entry}>
              <View style={styles.rail}><View style={[styles.dot, index === 0 && styles.currentDot]} /></View>
              <View style={styles.entryCopy}>
                <FlowText variant="metadata" tone={index === 0 ? 'gold' : 'muted'}>
                  {new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(snapshot.createdAt))}
                </FlowText>
                <FlowText>
                  {changed.length
                    ? changed.map((dimension) => `${dimensionLabels[dimension.id][locale]} ${dimension.change === 'opening' ? (locale === 'he' ? 'נפתח מעט' : 'opened') : locale === 'he' ? 'הצטמצם מעט' : 'compressed'}`).join(' · ')
                    : locale === 'he' ? 'לא הופיע שינוי ברור לעומת הרשומה הקודמת.' : 'No clear movement appeared relative to the previous entry.'}
                </FlowText>
                <FlowText variant="bodySmall" tone="muted">
                  {locale === 'he' ? `${snapshot.availableDegrees} ענפי פעולה נראו זמינים במודל ברגע הזה.` : `${snapshot.availableDegrees} action branches looked reachable in the model at this moment.`}
                </FlowText>
              </View>
            </View>
          );
        })}
      </Section>

      <Section style={styles.actions}>
        <Action label={tr('weekly', locale)} variant="secondary" onPress={() => router.push('/field/weekly')} />
        <Action label={tr('checkIn', locale)} onPress={() => router.push('/field/check-in')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  timeline: { gap: 0 },
  entry: { flexDirection: 'row', gap: spacing.md, minHeight: 112 },
  rail: { width: 20, alignItems: 'center', borderEndWidth: 1, borderEndColor: colors.line },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.blue, marginTop: spacing.xs, marginEnd: -10 },
  currentDot: { backgroundColor: colors.goldSoft, width: 13, height: 13, borderRadius: 7 },
  entryCopy: { flex: 1, gap: spacing.xs, paddingBottom: spacing.lg },
  actions: { gap: spacing.sm },
});
