import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { FlowText } from './Typography';
import { colors, spacing, touch } from '@/theme/tokens';

export function ToggleRow({ label, detail, value, onValueChange }: { label: string; detail?: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={styles.row}
    >
      <View style={styles.copy}>
        <FlowText style={styles.label}>{label}</FlowText>
        {detail ? <FlowText variant="bodySmall" tone="secondary">{detail}</FlowText> : null}
      </View>
      <Switch
        accessible={false}
        pointerEvents="none"
        value={value}
        trackColor={{ false: colors.surfaceQuiet, true: colors.teal }}
        thumbColor={value ? colors.paper : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: touch.minimum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  copy: { flex: 1, gap: spacing.xxs },
  label: { fontWeight: '600' },
});
