import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { SettingsRow } from '@/components/SettingsRow';
import { ToggleRow } from '@/components/ToggleRow';
import { Eyebrow, FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { tr, type CopyKey } from '@/i18n/strings';
import { useSettingsStore, type NotificationContext } from '@/state/settingsStore';
import { colors, spacing } from '@/theme/tokens';

const contextKeys: Record<Exclude<NotificationContext, 'never'>, CopyKey> = {
  morning: 'notificationMorning',
  evening: 'notificationEvening',
  after_work: 'notificationAfterWork',
  before_weekend: 'notificationBeforeWeekend',
  weekly: 'notificationWeekly',
};

export default function SettingsScreen() {
  const { locale } = useLocale();
  const quietMode = useSettingsStore((state) => state.quietMode);
  const setQuietMode = useSettingsStore((state) => state.setQuietMode);
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled);
  const notificationContext = useSettingsStore((state) => state.notificationContext);
  const notificationValue =
    notificationsEnabled && notificationContext !== 'never'
      ? tr(contextKeys[notificationContext], locale)
      : tr('off', locale);

  return (
    <Screen>
      <Action label={tr('back', locale)} variant="quiet" onPress={() => router.back()} style={styles.back} />

      <Section style={styles.hero}>
        <Eyebrow>{locale === 'he' ? 'שליטה · זיכרון · בחירה' : 'CONTROL · MEMORY · AGENCY'}</Eyebrow>
        <FlowText variant="screenTitle" accessibilityRole="header">
          {tr('settings', locale)}
        </FlowText>
        {!quietMode ? <FlowText tone="secondary">{tr('settingsLead', locale)}</FlowText> : null}
      </Section>

      <Section style={styles.group}>
        <SectionHeader title={tr('presentation', locale)} />
        <SettingsRow
          label={tr('language', locale)}
          detail={quietMode ? '' : tr('languageDetail', locale)}
          value={locale === 'he' ? tr('hebrew', locale) : tr('english', locale)}
          onPress={() => router.push('/settings/language')}
        />
        <ToggleRow
          label={tr('quietMode', locale)}
          detail={quietMode ? '' : tr('quietModeDetail', locale)}
          value={quietMode}
          onValueChange={setQuietMode}
        />
      </Section>

      <Section style={styles.group}>
        <SectionHeader title={tr('notifications', locale)} />
        <SettingsRow
          label={tr('notifications', locale)}
          detail={quietMode ? '' : tr('notificationLead', locale)}
          value={notificationValue}
          onPress={() => router.push('/settings/notifications')}
        />
      </Section>

      <Section style={styles.group}>
        <SectionHeader title={tr('privacy', locale)} />
        <SettingsRow
          label={tr('privacy', locale)}
          detail={quietMode ? '' : tr('privacyDetail', locale)}
          onPress={() => router.push('/settings/privacy')}
        />
        <SettingsRow
          label={tr('accountSync', locale)}
          detail={quietMode ? '' : tr('accountSyncDetail', locale)}
          onPress={() => router.push('/settings/account')}
        />
      </Section>

      <Section style={styles.group}>
        <SectionHeader title={tr('offlineAccess', locale)} />
        <SettingsRow
          label={tr('offlineAccess', locale)}
          detail={quietMode ? '' : tr('offlineAccessDetail', locale)}
          onPress={() => router.push('/offline')}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginTop: spacing.sm },
  hero: { gap: spacing.md },
  group: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.lg,
  },
});
