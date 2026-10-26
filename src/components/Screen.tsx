import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, maxReadingWidth, screenGutter, spacing } from '@/theme/tokens';
import { useLocale } from '@/hooks/useLocale';

interface ScreenProps extends ScrollViewProps {
  children: ReactNode;
  scroll?: boolean;
  warm?: boolean;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = true, warm = false, contentStyle, ...props }: ScreenProps) {
  const { rtl } = useLocale();
  const content = (
    <View style={[styles.content, { direction: rtl ? 'rtl' : 'ltr' }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, warm && styles.warm]} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function Section({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.section, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  warm: { backgroundColor: colors.warmCanvas },
  scrollContent: { flexGrow: 1 },
  content: {
    width: '100%',
    maxWidth: maxReadingWidth,
    alignSelf: 'center',
    paddingHorizontal: screenGutter,
    paddingBottom: 128,
  },
  section: { marginTop: spacing.section },
});
