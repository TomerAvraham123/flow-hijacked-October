import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FlowText } from './Typography';
import { colors, radii, spacing, touch } from '@/theme/tokens';

export interface Choice<T extends string | number> {
  value: T;
  label: string;
  detail?: string;
}

export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  multiple = false,
}: {
  label: string;
  options: Choice<T>[];
  value: T | T[] | undefined;
  onChange: (value: T) => void;
  multiple?: boolean;
}) {
  const selected = (option: T) => (Array.isArray(value) ? value.includes(option) : value === option);
  return (
    <View accessibilityRole={multiple ? undefined : 'radiogroup'} accessibilityLabel={label} style={styles.group}>
      {options.map((option) => {
        const active = selected(option.value);
        return <ChoiceItem key={String(option.value)} option={option} active={active} multiple={multiple} onChange={onChange} />;
      })}
    </View>
  );
}

function ChoiceItem<T extends string | number>({ option, active, multiple, onChange }: {
  option: Choice<T>;
  active: boolean;
  multiple: boolean;
  onChange: (value: T) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: active }}
      onPress={() => onChange(option.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [styles.choice, active && styles.active, pressed && styles.pressed, focused && styles.focused]}
    >
      <FlowText variant="bodySmall" tone={active ? 'primary' : 'secondary'} {...(active ? { style: styles.activeLabel } : {})}>
        {option.label}
      </FlowText>
      {option.detail ? <FlowText variant="metadata" tone="muted">{option.detail}</FlowText> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  choice: {
    minHeight: touch.minimum,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.canvasDeep,
  },
  active: { borderColor: colors.tealSoft, backgroundColor: 'rgba(42,166,161,0.14)' },
  activeLabel: { fontWeight: '600' },
  pressed: { opacity: 0.76 },
  focused: { borderColor: colors.goldSoft, borderWidth: 2 },
});
