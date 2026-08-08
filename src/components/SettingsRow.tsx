import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { FlowText } from './Typography';
import { useLocale } from '@/hooks/useLocale';
import { colors, spacing, touch } from '@/theme/tokens';

interface SettingsRowProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  detail?: string;
  value?: string;
  trailing?: ReactNode;
  destructive?: boolean;
  selected?: boolean;
}

/**
 * A restrained, full-width settings control. It deliberately avoids card-like
 * decoration and keeps the complete row inside a comfortable touch target.
 */
export function SettingsRow({
  label,
  detail,
  value,
  trailing,
  destructive = false,
  selected,
  disabled,
  accessibilityHint,
  ...props
}: SettingsRowProps) {
  const { rtl } = useLocale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={selected === undefined ? { disabled: Boolean(disabled) } : { disabled: Boolean(disabled), selected }}
      disabled={disabled}
      {...props}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.copy}>
        <FlowText style={[styles.label, ...(destructive ? [styles.destructive] : [])]}>{label}</FlowText>
        {detail ? (
          <FlowText variant="bodySmall" tone="secondary">
            {detail}
          </FlowText>
        ) : null}
      </View>

      <View style={styles.trailing}>
        {value ? (
          <FlowText variant="bodySmall" tone={selected ? 'teal' : 'secondary'}>
            {value}
          </FlowText>
        ) : null}
        {trailing ?? (
          <FlowText variant="subheading" tone={destructive ? 'muted' : 'teal'} accessibilityElementsHidden>
            {rtl ? '‹' : '›'}
          </FlowText>
        )}
      </View>
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
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  copy: { flex: 1, gap: spacing.xxs },
  label: { fontWeight: '600' },
  destructive: { color: colors.destructive },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 0 },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.42 },
});
