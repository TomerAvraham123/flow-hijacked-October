import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { colors, radii, spacing } from '@/theme/tokens';

function LocalStatusRow({ label, status }: { label: string; status: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${status}`}
      style={styles.statusRow}
    >
      <FlowText style={styles.statusLabel}>{label}</FlowText>
      <FlowText variant="bodySmall" tone="teal">
        {status}
      </FlowText>
    </View>
  );
}

export default function AccountSettingsScreen() {
  const { locale } = useLocale();

  return (
    <Screen>
      <Action label={tr('back', locale)} variant="quiet" onPress={() => router.back()} style={styles.back} />

      <Section style={styles.hero}>
        <FlowText variant="screenTitle" accessibilityRole="header">
          {tr('accountSync', locale)}
        </FlowText>
        <FlowText tone="secondary">{tr('accountLead', locale)}</FlowText>
      </Section>

      <Section style={styles.local}>
        <SectionHeader title={tr('usingLocally', locale)} body={tr('usingLocallyDetail', locale)} />
        <View style={styles.rows}>
          <LocalStatusRow
            label={tr('recoverySync', locale)}
            status={tr('onThisDevice', locale)}
          />
          <LocalStatusRow
            label={tr('knowledgeSync', locale)}
            status={tr('onThisDevice', locale)}
          />
        </View>
      </Section>

      <Section style={styles.notice}>
        <FlowText variant="subheading" accessibilityRole="header">
          {tr('signInUnavailable', locale)}
        </FlowText>
        <FlowText tone="secondary">{tr('signInUnavailableDetail', locale)}</FlowText>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginTop: spacing.sm },
  hero: { gap: spacing.md },
  local: { gap: spacing.lg },
  rows: { borderTopWidth: 1, borderTopColor: colors.line },
  statusRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  statusLabel: { flex: 1, fontWeight: '600' },
  notice: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.sheet,
    backgroundColor: colors.surface,
  },
});
