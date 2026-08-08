import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { SettingsRow } from '@/components/SettingsRow';
import { FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { useSettingsStore } from '@/state/settingsStore';
import { colors, spacing } from '@/theme/tokens';

function SelectionMark({ selected }: { selected: boolean }) {
  return (
    <FlowText tone={selected ? 'teal' : 'muted'} accessibilityElementsHidden>
      {selected ? '●' : '○'}
    </FlowText>
  );
}

export default function LanguageSettingsScreen() {
  const { locale } = useLocale();
  const setLocale = useSettingsStore((state) => state.setLocale);

  return (
    <Screen>
      <Action label={tr('back', locale)} variant="quiet" onPress={() => router.back()} style={styles.back} />
      <Section style={styles.hero}>
        <FlowText variant="screenTitle" accessibilityRole="header">
          {tr('language', locale)}
        </FlowText>
        <FlowText tone="secondary">{tr('languageLead', locale)}</FlowText>
      </Section>

      <Section style={styles.options}>
        <View accessibilityRole="radiogroup" accessibilityLabel={tr('language', locale)}>
          <SettingsRow
            label="English"
            detail="Use Flow Hijacked in English"
            selected={locale === 'en'}
            accessibilityRole="radio"
            trailing={<SelectionMark selected={locale === 'en'} />}
            onPress={() => setLocale('en')}
          />
          <SettingsRow
            label="עברית"
            detail="להשתמש ב־Flow Hijacked בעברית טבעית וזורמת"
            selected={locale === 'he'}
            accessibilityRole="radio"
            trailing={<SelectionMark selected={locale === 'he'} />}
            onPress={() => setLocale('he')}
          />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginTop: spacing.sm },
  hero: { gap: spacing.md },
  options: { borderTopWidth: 1, borderTopColor: colors.line },
});
