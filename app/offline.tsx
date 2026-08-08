import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { useContinuityStore } from '@/state/continuityStore';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, radii, spacing } from '@/theme/tokens';

function AvailabilityRow({ count, label }: { count: number; label: string }) {
  return (
    <View style={styles.availabilityRow} accessible accessibilityLabel={`${label}: ${count}`}>
      <FlowText variant="sectionTitle" tone="gold">
        {count}
      </FlowText>
      <FlowText tone="secondary" style={styles.availabilityLabel}>
        {label}
      </FlowText>
    </View>
  );
}

export default function OfflineScreen() {
  const { locale } = useLocale();
  const network = useNetInfo();
  const [refreshing, setRefreshing] = useState(false);
  const recoveryCount = useRecoveryStore((state) => state.minimalReturns.length + state.checkIns.length);
  const savedAnswers = useAskStore((state) => state.savedAnswers.length);
  const savedItems = useContinuityStore((state) => state.saved.length);

  const connectionKnown = network.isConnected !== null || network.isInternetReachable !== null;
  const online = network.isConnected === true && network.isInternetReachable !== false;
  const title = !connectionKnown
    ? tr('checkingConnection', locale)
    : online
      ? tr('connectionRestored', locale)
      : tr('offline', locale);

  async function refreshConnection() {
    setRefreshing(true);
    try {
      await NetInfo.refresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <Screen>
      <Action label={tr('back', locale)} variant="quiet" onPress={() => router.back()} style={styles.back} />

      <Section style={styles.hero}>
        <View style={[styles.statusMark, online && styles.statusMarkOnline]} accessibilityElementsHidden />
        <FlowText variant="screenTitle" accessibilityRole="header">
          {title}
        </FlowText>
        <FlowText tone="secondary">
          {online ? tr('offlineAccessDetail', locale) : tr('offlineLead', locale)}
        </FlowText>
      </Section>

      <Section style={styles.available}>
        <FlowText variant="sectionTitle" accessibilityRole="header">
          {tr('availableOffline', locale)}
        </FlowText>
        <View style={styles.availabilityList}>
          <AvailabilityRow count={recoveryCount} label={tr('offlineFieldEntries', locale)} />
          <AvailabilityRow count={savedAnswers} label={tr('offlineSavedAnswers', locale)} />
          <AvailabilityRow count={savedItems} label={tr('offlineSavedItems', locale)} />
        </View>
      </Section>

      <Section style={styles.boundary}>
        <FlowText>{tr('offlineBoundary', locale)}</FlowText>
      </Section>

      <Section>
        <Action
          label={tr('retryConnection', locale)}
          detail={refreshing ? tr('checkingConnection', locale) : ''}
          variant="secondary"
          disabled={refreshing}
          onPress={() => void refreshConnection()}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginTop: spacing.sm },
  hero: { gap: spacing.md },
  statusMark: {
    width: 40,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  statusMarkOnline: { backgroundColor: colors.teal },
  available: { gap: spacing.lg },
  availabilityList: { borderTopWidth: 1, borderTopColor: colors.line },
  availabilityRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  availabilityLabel: { flex: 1 },
  boundary: {
    padding: spacing.lg,
    borderRadius: radii.sheet,
    backgroundColor: colors.surface,
  },
});
