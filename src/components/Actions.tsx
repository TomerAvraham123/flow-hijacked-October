import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewStyle } from 'react-native';

import { FlowText } from './Typography';
import { colors, radii, spacing, touch } from '@/theme/tokens';

interface ActionProps extends PressableProps {
  label: string;
  detail?: string;
  trailing?: ReactNode;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  style?: ViewStyle;
}

export function Action({ label, detail, trailing, variant = 'primary', disabled, style, onFocus, onBlur, ...props }: ActionProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      {...props}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        focused && styles.focused,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.copy}>
        <FlowText variant="body" tone={variant === 'primary' ? 'ink' : 'primary'} style={styles.label}>
          {label}
        </FlowText>
        {detail ? (
          <FlowText variant="bodySmall" tone={variant === 'primary' ? 'ink' : 'secondary'}>
            {detail}
          </FlowText>
        ) : null}
      </View>
      {trailing ?? (
        <FlowText variant="subheading" tone={variant === 'primary' ? 'ink' : 'teal'} accessibilityElementsHidden>
          ↗
        </FlowText>
      )}
    </Pressable>
  );
}

export function InlineActions({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.inline, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.primaryHeight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.action,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  primary: { backgroundColor: colors.paper },
  secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.lineStrong },
  quiet: { backgroundColor: colors.transparent, borderWidth: 1, borderColor: colors.line },
  danger: { backgroundColor: 'rgba(199,130,119,0.10)', borderWidth: 1, borderColor: colors.destructive },
  pressed: { opacity: 0.78, transform: [{ scale: 0.995 }] },
  focused: { borderColor: colors.goldSoft, borderWidth: 2 },
  disabled: { opacity: 0.42 },
  copy: { flex: 1, gap: spacing.xxs },
  label: { fontWeight: '600' },
  inline: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
