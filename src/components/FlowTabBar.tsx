import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { FlowText } from './Typography';
import { useLocale } from '@/hooks/useLocale';
import { tr } from '@/i18n/strings';
import { colors, spacing, touch } from '@/theme/tokens';

const meta = {
  now: { label: 'now' as const, glyph: '⌾' },
  field: { label: 'field' as const, glyph: '⌁' },
  ask: { label: 'ask' as const, glyph: '?' },
  explore: { label: 'explore' as const, glyph: '≡' },
};

export function FlowTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const { locale, rtl } = useLocale();
  const { fontScale } = useWindowDimensions();
  const routes = rtl ? [...state.routes].reverse() : state.routes;
  const height = Math.min(132, Math.max(74, 74 + (fontScale - 1) * 46));

  return (
    <View style={[styles.frame, { height: height + insets.bottom, paddingBottom: insets.bottom }]}>
      {routes.map((route) => {
        const originalIndex = state.routes.findIndex((entry) => entry.key === route.key);
        const focused = state.index === originalIndex;
        const item = meta[route.name as keyof typeof meta];
        if (!item) return null;
        const options = descriptors[route.key]?.options;
        const label = tr(item.label, locale);

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
            accessibilityState={{ selected: focused }}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={({ pressed }) => [styles.item, focused && styles.itemFocused, pressed && styles.itemPressed]}
          >
            <FlowText variant="subheading" tone={focused ? 'gold' : 'muted'}>{item.glyph}</FlowText>
            <FlowText variant="metadata" tone={focused ? 'primary' : 'muted'} align="center" numberOfLines={2}>
              {label}
            </FlowText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flexDirection: 'row',
    backgroundColor: colors.canvasDeep,
    borderTopWidth: 1,
    borderTopColor: colors.lineStrong,
    paddingHorizontal: spacing.xs,
  },
  item: {
    flex: 1,
    minWidth: touch.minimum,
    minHeight: touch.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderTopWidth: 2,
    borderTopColor: colors.transparent,
  },
  itemFocused: { borderTopColor: colors.goldSoft, backgroundColor: 'rgba(199,154,59,0.04)' },
  itemPressed: { opacity: 0.72 },
});
