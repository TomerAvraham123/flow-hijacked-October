import { StyleSheet, View } from 'react-native';

import { FlowText } from './Typography';
import { colors, spacing } from '@/theme/tokens';

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <View accessibilityRole="header" accessibilityLabel="Flow Hijacked" style={styles.row}>
      <FlowText variant="metadata" style={styles.flow}>FLOW</FlowText>
      <FlowText variant="metadata" style={styles.hijacked}>HIJACKED</FlowText>
      {!compact ? <View style={styles.rule} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flow: { color: colors.textStrong, fontWeight: '600', letterSpacing: 1.8 },
  hijacked: { color: colors.tealSoft, fontWeight: '600', letterSpacing: 1.8 },
  rule: { flex: 1, height: 1, marginStart: spacing.sm, backgroundColor: colors.line },
});
