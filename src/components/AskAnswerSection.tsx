import { StyleSheet, View } from 'react-native';

import { FlowText } from './Typography';
import { colors, spacing } from '@/theme/tokens';
import type { AskAnswer } from '@/types/ask';

type AnswerSection = AskAnswer['directAnswer'];

export function AskAnswerSection({ index, section, direct = false }: { index: string; section: AnswerSection | undefined; direct?: boolean }) {
  if (!section?.body) return null;
  return (
    <View style={[styles.section, direct && styles.direct]}>
      <View style={styles.rail}><FlowText variant="metadata" tone={direct ? 'gold' : 'teal'}>{index}</FlowText></View>
      <View style={styles.copy}>
        <FlowText variant={direct ? 'sectionTitle' : 'subheading'} accessibilityRole="header">{section.title}</FlowText>
        <FlowText tone={direct ? 'primary' : 'secondary'}>{section.body}</FlowText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.line },
  direct: { paddingTop: spacing.xxl },
  rail: { width: 26 },
  copy: { flex: 1, gap: spacing.sm },
});
