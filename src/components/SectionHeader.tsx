import { StyleSheet, View } from 'react-native';

import { Eyebrow, FlowText } from './Typography';
import { spacing } from '@/theme/tokens';

export function SectionHeader({ index, eyebrow, title, body }: { index?: string; eyebrow?: string; title: string; body?: string }) {
  return (
    <View style={styles.wrapper}>
      {eyebrow || index ? <Eyebrow>{[index, eyebrow].filter(Boolean).join(' · ')}</Eyebrow> : null}
      <FlowText variant="sectionTitle" accessibilityRole="header">
        {title}
      </FlowText>
      {body ? <FlowText tone="secondary">{body}</FlowText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
});
