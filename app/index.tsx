import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Wordmark } from '@/components/Wordmark';
import { useSettingsStore } from '@/state/settingsStore';
import { colors } from '@/theme/tokens';

export default function EntryScreen() {
  const hydrated = useSettingsStore((state) => state.hydrated);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(onboardingComplete ? '/(tabs)/now' : '/onboarding');
  }, [hydrated, onboardingComplete]);

  return (
    <View style={styles.screen}>
      <Wordmark compact />
      <ActivityIndicator color={colors.tealSoft} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24, backgroundColor: colors.canvas },
});
