import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { SettingsRow } from '@/components/SettingsRow';
import { ToggleRow } from '@/components/ToggleRow';
import { FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { tr, type CopyKey } from '@/i18n/strings';
import { useSettingsStore, type NotificationContext } from '@/state/settingsStore';
import { colors, radii, spacing } from '@/theme/tokens';
import {
  cancelGentleReturnNotifications,
  scheduleGentleReturnNotification,
  type GentleReturnResult,
} from '@/utils/notifications';

interface ScheduleChoice {
  context: Exclude<NotificationContext, 'never'>;
  hour: number;
  label: CopyKey;
  cadence: CopyKey;
}

const choices: ScheduleChoice[] = [
  { context: 'morning', hour: 8, label: 'notificationMorning', cadence: 'notificationDaily' },
  { context: 'after_work', hour: 18, label: 'notificationAfterWork', cadence: 'notificationDaily' },
  { context: 'evening', hour: 20, label: 'notificationEvening', cadence: 'notificationDaily' },
  { context: 'before_weekend', hour: 17, label: 'notificationBeforeWeekend', cadence: 'notificationFriday' },
  { context: 'weekly', hour: 18, label: 'notificationWeekly', cadence: 'notificationSunday' },
];

type StatusMessage = 'saved' | 'denied' | 'failed' | null;

function resultMessage(result: GentleReturnResult): StatusMessage {
  if (result.status === 'scheduled') return 'saved';
  if (result.status === 'denied') return 'denied';
  return 'failed';
}

function formatTime(hour: number, locale: 'en' | 'he'): string {
  const date = new Date(2020, 0, 1, hour, 0, 0);
  return new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function SelectionMark({ selected }: { selected: boolean }) {
  return (
    <FlowText tone={selected ? 'teal' : 'muted'} accessibilityElementsHidden>
      {selected ? '●' : '○'}
    </FlowText>
  );
}

export default function NotificationSettingsScreen() {
  const { locale } = useLocale();
  const enabled = useSettingsStore((state) => state.notificationsEnabled);
  const selectedContext = useSettingsStore((state) => state.notificationContext);
  const selectedHour = useSettingsStore((state) => state.notificationHour);
  const setPreference = useSettingsStore((state) => state.setNotificationPreference);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);

  async function enableOrDisable(nextEnabled: boolean) {
    if (busy) return;
    setBusy(true);
    setStatus(null);

    if (!nextEnabled) {
      try {
        await cancelGentleReturnNotifications();
        setPreference(false, 'never', selectedHour);
      } catch {
        setStatus('failed');
      } finally {
        setBusy(false);
      }
      return;
    }

    const fallback = choices.find((choice) => choice.context === 'evening') ?? choices[0];
    if (!fallback) {
      setStatus('failed');
      setBusy(false);
      return;
    }
    const context = selectedContext === 'never' ? fallback.context : selectedContext;
    const hour = selectedContext === 'never' ? fallback.hour : selectedHour;
    const result = await scheduleGentleReturnNotification(context, hour, locale);
    setStatus(resultMessage(result));
    if (result.status === 'scheduled') setPreference(true, context, hour);
    setBusy(false);
  }

  async function chooseSchedule(choice: ScheduleChoice) {
    if (!enabled || busy) return;
    setBusy(true);
    setStatus(null);
    const result = await scheduleGentleReturnNotification(choice.context, choice.hour, locale);
    setStatus(resultMessage(result));
    if (result.status === 'scheduled') setPreference(true, choice.context, choice.hour);
    setBusy(false);
  }

  const statusCopy =
    status === 'saved'
      ? tr('notificationSaved', locale)
      : status === 'denied'
        ? tr('notificationPermissionDenied', locale)
        : status === 'failed'
          ? tr('notificationScheduleFailed', locale)
          : null;

  return (
    <Screen>
      <Action label={tr('back', locale)} variant="quiet" onPress={() => router.back()} style={styles.back} />

      <Section style={styles.hero}>
        <FlowText variant="screenTitle" accessibilityRole="header">
          {tr('notifications', locale)}
        </FlowText>
        <FlowText tone="secondary">{tr('notificationLead', locale)}</FlowText>
      </Section>

      <Section style={styles.toggleSurface}>
        <ToggleRow
          label={tr('enableNotifications', locale)}
          detail={tr('enableNotificationsDetail', locale)}
          value={enabled}
          onValueChange={(value) => void enableOrDisable(value)}
        />
      </Section>

      {statusCopy ? (
        <View
          accessibilityRole={status === 'denied' || status === 'failed' ? 'alert' : undefined}
          accessibilityLiveRegion="polite"
          style={[styles.status, status !== 'saved' && styles.statusWarning]}
        >
          <FlowText variant="bodySmall">{statusCopy}</FlowText>
          {status === 'denied' ? (
            <Action
              label={tr('openSystemSettings', locale)}
              variant="quiet"
              onPress={() => void Linking.openSettings()}
            />
          ) : null}
        </View>
      ) : null}

      <Section style={styles.choices}>
        <SectionHeader title={tr('chooseMoment', locale)} />
        <View accessibilityRole="radiogroup" accessibilityLabel={tr('chooseMoment', locale)}>
          {choices.map((choice) => {
            const selected = enabled && selectedContext === choice.context;
            const detail = `${formatTime(choice.hour, locale)} · ${tr(choice.cadence, locale)}`;
            return (
              <SettingsRow
                key={choice.context}
                label={tr(choice.label, locale)}
                detail={detail}
                selected={selected}
                disabled={!enabled || busy}
                accessibilityRole="radio"
                trailing={<SelectionMark selected={selected} />}
                onPress={() => void chooseSchedule(choice)}
              />
            );
          })}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginTop: spacing.sm },
  hero: { gap: spacing.md },
  toggleSurface: {
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sheet,
    backgroundColor: colors.surface,
  },
  choices: { gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.lg },
  status: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.teal,
    backgroundColor: colors.surface,
  },
  statusWarning: { borderLeftColor: colors.gold },
});
