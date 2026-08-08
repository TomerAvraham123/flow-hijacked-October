import type { PropsWithChildren } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fontFamilies, typography } from '@/theme/tokens';
import { useLocale } from '@/hooks/useLocale';

type Tone = 'primary' | 'secondary' | 'muted' | 'gold' | 'teal' | 'ink';

const toneColor: Record<Tone, string> = {
  primary: colors.text,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  gold: colors.goldSoft,
  teal: colors.tealSoft,
  ink: colors.ink,
};

interface FlowTextProps extends TextProps {
  variant?: keyof typeof typography;
  tone?: Tone;
  serif?: boolean;
  align?: 'start' | 'center' | 'end';
  style?: TextStyle | TextStyle[];
}

export function FlowText({
  children,
  variant = 'body',
  tone = 'primary',
  serif = false,
  align = 'start',
  style,
  ...props
}: PropsWithChildren<FlowTextProps>) {
  const { rtl } = useLocale();
  const textAlign = align === 'center' ? 'center' : align === 'end' ? (rtl ? 'left' : 'right') : rtl ? 'right' : 'left';

  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={2.2}
      {...props}
      style={[
        typography[variant],
        {
          color: toneColor[tone],
          fontFamily: serif ? fontFamilies.serif : fontFamilies.sans,
          textAlign,
          writingDirection: rtl ? 'rtl' : 'ltr',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Eyebrow({ children, tone = 'teal' }: PropsWithChildren<{ tone?: Tone }>) {
  const { rtl } = useLocale();
  return (
    <FlowText variant="metadata" tone={tone} style={{ letterSpacing: rtl ? 0.15 : 1.1 }}>
      {children}
    </FlowText>
  );
}
