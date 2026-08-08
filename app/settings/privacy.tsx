import { router } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Alert, StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { useContinuityStore } from '@/state/continuityStore';
import { useRecoveryStore } from '@/state/recoveryStore';
import { destroyEncryptedStorage } from '@/storage/encryptedStorage';
import { colors, radii, spacing } from '@/theme/tokens';

type DeletedMemory = 'recovery' | 'ask' | 'reading' | null;

export default function PrivacySettingsScreen() {
  useSensitiveScreenProtection('privacy-settings');
  const { locale } = useLocale();
  const clearRecoveryMemory = useRecoveryStore((state) => state.clearRecoveryMemory);
  const forgetAskMemory = useAskStore((state) => state.forgetAskMemory);
  const clearReadingContinuity = useContinuityStore((state) => state.clear);
  const [deleted, setDeleted] = useState<DeletedMemory>(null);
  const [deletionFailed, setDeletionFailed] = useState(false);

  function announce(message: string) {
    void AccessibilityInfo.announceForAccessibility(message);
  }

  async function deleteRecovery() {
    clearRecoveryMemory();
    try {
      await useRecoveryStore.persist.clearStorage();
      await destroyEncryptedStorage('recovery');
      setDeletionFailed(false);
      setDeleted('recovery');
      announce(tr('recoveryDeleted', locale));
    } catch {
      setDeletionFailed(true);
      announce(locale === 'he' ? 'לא הצלחנו למחוק את הנתונים המקומיים.' : 'Local data could not be deleted.');
    }
  }

  async function deleteAsk() {
    forgetAskMemory(locale);
    try {
      await useAskStore.persist.clearStorage();
      await destroyEncryptedStorage('knowledge');
      setDeletionFailed(false);
      setDeleted('ask');
      announce(tr('askDeleted', locale));
    } catch {
      setDeletionFailed(true);
      announce(locale === 'he' ? 'לא הצלחנו למחוק את הנתונים המקומיים.' : 'Local data could not be deleted.');
    }
  }

  async function deleteReading() {
    clearReadingContinuity();
    try {
      await useContinuityStore.persist.clearStorage();
      await destroyEncryptedStorage('continuity');
      setDeletionFailed(false);
      setDeleted('reading');
      announce(tr('readingDeleted', locale));
    } catch {
      setDeletionFailed(true);
      announce(locale === 'he' ? 'לא הצלחנו למחוק את הנתונים המקומיים.' : 'Local data could not be deleted.');
    }
  }

  function confirmRecoveryDeletion() {
    Alert.alert(tr('confirmDeleteRecovery', locale), `${tr('recoveryMemoryDetail', locale)}\n\n${tr('deletionCannotUndo', locale)}`, [
      { text: tr('cancel', locale), style: 'cancel' },
      {
        text: tr('delete', locale),
        style: 'destructive',
        onPress: () => void deleteRecovery(),
      },
    ]);
  }

  function confirmAskDeletion() {
    Alert.alert(tr('confirmDeleteAsk', locale), `${tr('askDeleteDetail', locale)}\n\n${tr('deletionCannotUndo', locale)}`, [
      { text: tr('cancel', locale), style: 'cancel' },
      {
        text: tr('delete', locale),
        style: 'destructive',
        onPress: () => void deleteAsk(),
      },
    ]);
  }

  function confirmReadingDeletion() {
    Alert.alert(tr('confirmDeleteReading', locale), `${tr('readingDeleteDetail', locale)}\n\n${tr('deletionCannotUndo', locale)}`, [
      { text: tr('cancel', locale), style: 'cancel' },
      {
        text: tr('delete', locale),
        style: 'destructive',
        onPress: () => void deleteReading(),
      },
    ]);
  }

  const deletedMessage =
    deleted === 'recovery'
      ? tr('recoveryDeleted', locale)
      : deleted === 'ask'
        ? tr('askDeleted', locale)
        : deleted === 'reading'
          ? tr('readingDeleted', locale)
        : null;

  return (
    <Screen>
      <Action label={tr('back', locale)} variant="quiet" onPress={() => router.back()} style={styles.back} />

      <Section style={styles.hero}>
        <FlowText variant="screenTitle" accessibilityRole="header">
          {tr('privacy', locale)}
        </FlowText>
        <FlowText tone="secondary">{tr('privacyLead', locale)}</FlowText>
      </Section>

      {deletedMessage ? (
        <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.confirmation}>
          <FlowText variant="bodySmall">{deletedMessage}</FlowText>
        </View>
      ) : null}

      {deletionFailed ? (
        <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.deletionError}>
          <FlowText variant="bodySmall" tone="gold">
            {locale === 'he'
              ? 'לא הצלחנו להשלים את המחיקה המקומית. הנתונים הוסרו מהמסך, אבל כדאי לנסות שוב לפני שמניחים שהמחיקה הושלמה.'
              : 'Local deletion did not complete. The data was removed from the screen, but please try again before assuming deletion is complete.'}
          </FlowText>
        </View>
      ) : null}

      <Section style={styles.memorySection}>
        <SectionHeader title={tr('field', locale)} body={tr('recoveryMemoryDetail', locale)} />
        <Action label={tr('deleteRecovery', locale)} variant="danger" onPress={confirmRecoveryDeletion} />
      </Section>

      <Section style={styles.memorySection}>
        <SectionHeader title={tr('askMemory', locale)} body={tr('askDeleteDetail', locale)} />
        <Action label={tr('deleteAsk', locale)} variant="danger" onPress={confirmAskDeletion} />
      </Section>

      <Section style={styles.memorySection}>
        <SectionHeader title={tr('readingQueue', locale)} body={tr('readingDeleteDetail', locale)} />
        <Action label={tr('deleteReading', locale)} variant="danger" onPress={confirmReadingDeletion} />
      </Section>

      <Section style={styles.boundary}>
        <FlowText variant="bodySmall" tone="secondary">
          {tr('memoryBoundary', locale)}
        </FlowText>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginTop: spacing.sm },
  hero: { gap: spacing.md },
  memorySection: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  confirmation: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.action,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: colors.surface,
  },
  deletionError: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.action,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.surface,
  },
  boundary: {
    padding: spacing.lg,
    borderRadius: radii.action,
    backgroundColor: colors.surface,
  },
});
