import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, radii, spacing, touch } from '@/theme/tokens';
import type { SmallestReturn } from '@/types/recovery';

const options: { value: SmallestReturn; key: 'better' | 'same' | 'harder' | 'unsure'; mark: string }[] = [
  { value: 'better', key: 'better', mark: '↗' },
  { value: 'same', key: 'same', mark: '—' },
  { value: 'harder', key: 'harder', mark: '↘' },
  { value: 'unsure', key: 'unsure', mark: '?' },
];

export default function SmallestReturnScreen() {
  useSensitiveScreenProtection('smallest-return');
  const { locale } = useLocale();
  const record = useRecoveryStore((state) => state.recordMinimalReturn);
  const [selected, setSelected] = useState<SmallestReturn | null>(null);

  async function choose(value: SmallestReturn) {
    record(value);
    setSelected(value);
    await Haptics.selectionAsync();
  }

  return (
    <Screen scroll={false} contentStyle={styles.content}>
      <Wordmark />
      <Section style={styles.hero}>
        <Eyebrow>{locale === 'he' ? 'החזרה הקטנה ביותר · כ־20 שניות' : 'SMALLEST RETURN / 20 SEC'}</Eyebrow>
        <FlowText variant="display" serif accessibilityRole="header">{tr('changed', locale)}</FlowText>
        <FlowText tone="secondary">
          {locale === 'he' ? 'לא צריך להסביר. בחרו את האפשרות הקרובה ביותר.' : 'No explanation required. Choose the closest fit.'}
        </FlowText>
      </Section>

      {!selected ? (
        <View style={styles.options} accessibilityRole="radiogroup">
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={tr(option.key, locale)}
              accessibilityState={{ checked: false }}
              onPress={() => void choose(option.value)}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            >
              <FlowText variant="sectionTitle" tone="teal" accessibilityElementsHidden>{option.mark}</FlowText>
              <FlowText variant="subheading">{tr(option.key, locale)}</FlowText>
            </Pressable>
          ))}
        </View>
      ) : (
        <View accessibilityLiveRegion="polite" style={styles.saved}>
          <View style={styles.savedMark}><FlowText variant="sectionTitle" tone="gold">✓</FlowText></View>
          <FlowText variant="sectionTitle" accessibilityRole="header">{tr('savedStop', locale)}</FlowText>
          <FlowText tone="secondary">
            {locale === 'he'
              ? 'לא נוצר חוב למחר, ולא צריך להשלים דבר.'
              : 'No debt was created for tomorrow, and there is nothing to catch up on.'}
          </FlowText>
          <Action
            label={tr('tellMore', locale)}
            variant="secondary"
            onPress={() => router.replace({ pathname: '/field/check-in', params: { return: selected } })}
          />
          <Action label={tr('close', locale)} variant="quiet" onPress={() => router.back()} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  hero: { gap: spacing.md },
  options: { marginTop: spacing.xxl, gap: spacing.sm },
  option: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.action,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  optionPressed: { opacity: 0.76 },
  saved: { marginTop: spacing.hero, gap: spacing.lg },
  savedMark: { width: touch.primaryHeight, height: touch.primaryHeight, borderRadius: touch.primaryHeight / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.gold },
});
