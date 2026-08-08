import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlowText } from './Typography';
import { tr } from '@/i18n/strings';
import { useLocale } from '@/hooks/useLocale';
import { colors, spacing } from '@/theme/tokens';

export function NetworkBanner() {
  const [online, setOnline] = useState(true);
  const { locale } = useLocale();

  useEffect(() => NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)), []);
  if (online) return null;

  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <FlowText variant="bodySmall">{tr('offline', locale)} · {tr('offlineLead', locale)}</FlowText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surfaceRaised,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
